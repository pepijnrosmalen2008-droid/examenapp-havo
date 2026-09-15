// ─────────────────────────────────────────────────────────────────────────
// slagio-ai  ·  Supabase Edge Function (Deno)
//
// De AI-laag van Slagio Plus. Twee taken via één endpoint (veld `mode`):
//   mode:"grade"   → een open examenvraag nakijken tegen het scoringsvoorschrift
//   mode:"uitleg"  → een korte persoonlijke uitleg genereren
//
// DE SERVER IS DE BRON VAN WAARHEID. Vóór er ook maar één (betaalde) AI-call
// gebeurt, controleert deze functie zelf, in deze volgorde:
//   1. Is de gebruiker ingelogd?  (token uit de Authorization-header)
//   2. Is die gebruiker Plus?      (tabel plus_status, via de service-rol)
//   3. Is het week-quotum vrij?    (tabel ai_usage, via de service-rol)
// Pas dan gaat de AI-request eruit, en telt het verbruik +1. Zo kan niemand met
// DevTools zichzelf Plus geven of het quotum omzeilen: de frontend beslist niets.
//
// De API-key en de service-rol staan ALLEEN hier (Deno.env), nooit in de client.
//
// Deploy:  supabase functions deploy slagio-ai --no-verify-jwt
// Secrets: supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
//   (SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY worden
//    automatisch door Supabase in de functie geïnjecteerd — die hoef je niet
//    zelf te zetten.)
// ─────────────────────────────────────────────────────────────────────────

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-4-5"; // goedkoop + capabel; nakijken is een afgebakende taak

// Fair-use-limieten (per ISO-week, server-afgedwongen). Pas gerust aan.
const WEEKLY_PLUS = 50;  // Plus-leden: ruime eerlijk-gebruik-grens
const WEEKLY_TRIAL = 3;  // niet-Plus: gratis proef om AI te laten proeven

const SB_URL = Deno.env.get("SUPABASE_URL") || "";
const SB_ANON = Deno.env.get("SUPABASE_ANON_KEY") || "";
const SB_SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, apikey",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "content-type": "application/json" },
  });
}

// ── ISO-weeksleutel, bv. "2026-W38" ───────────────────────────────────────
function isoWeekKey(d = new Date()): string {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((t.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${t.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

// ── Wie is de ingelogde gebruiker? (token → auth-service) ─────────────────
async function getUser(token: string): Promise<{ id: string } | null> {
  if (!token || !SB_URL) return null;
  try {
    const r = await fetch(`${SB_URL}/auth/v1/user`, {
      headers: { apikey: SB_ANON, authorization: `Bearer ${token}` },
    });
    if (!r.ok) return null;
    const u = await r.json();
    return u && u.id ? { id: u.id } : null;
  } catch {
    return null;
  }
}

// ── Is deze gebruiker Plus? (leest plus_status met de service-rol) ────────
async function userIsPlus(userId: string): Promise<boolean> {
  try {
    const r = await fetch(
      `${SB_URL}/rest/v1/plus_status?user_id=eq.${userId}&select=plus_until`,
      { headers: { apikey: SB_SERVICE, authorization: `Bearer ${SB_SERVICE}` } },
    );
    if (!r.ok) return false;
    const rows = await r.json();
    const until = rows?.[0]?.plus_until;
    return !!until && Date.parse(until) > Date.now();
  } catch {
    return false;
  }
}

// ── Hoeveel AI-beurten deze week? ─────────────────────────────────────────
async function usageCount(userId: string, periode: string): Promise<number> {
  try {
    const r = await fetch(
      `${SB_URL}/rest/v1/ai_usage?user_id=eq.${userId}&periode=eq.${periode}&select=aantal`,
      { headers: { apikey: SB_SERVICE, authorization: `Bearer ${SB_SERVICE}` } },
    );
    if (!r.ok) return 0;
    const rows = await r.json();
    return rows?.[0]?.aantal ?? 0;
  } catch {
    return 0;
  }
}

// ── Verbruik +1 (upsert) ──────────────────────────────────────────────────
async function usageInc(userId: string, periode: string, current: number) {
  try {
    await fetch(`${SB_URL}/rest/v1/ai_usage?on_conflict=user_id,periode`, {
      method: "POST",
      headers: {
        apikey: SB_SERVICE,
        authorization: `Bearer ${SB_SERVICE}`,
        "content-type": "application/json",
        prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({
        user_id: userId,
        periode,
        aantal: current + 1,
        updated_at: new Date().toISOString(),
      }),
    });
  } catch {
    // telling is best-effort; een mislukte telling mag de gebruiker niet blokkeren
  }
}

// ── De nakijk-prompt ──────────────────────────────────────────────────────
// Streng, rubric-gebonden. De AI mag alleen punten toekennen die het scorings-
// voorschrift noemt, en beoordeelt inhoud (niet spelling/formulering).
function buildGradePrompt(p: {
  vraag: string;
  modelantwoord: string;
  punten: { id: number; pts: number; text: string }[];
  leerlingantwoord: string;
  context?: string;
  vak?: string;
}) {
  const rubric = p.punten
    .map((d) => `- Scoringspunt ${d.id} (${d.pts} pt): ${d.text}`)
    .join("\n");
  const system =
    `Je bent een ervaren, strenge maar eerlijke examinator voor het Nederlandse ` +
    `eindexamen${p.vak ? ` ${p.vak}` : ""}. Je kijkt één open vraag na aan de hand van ` +
    `het officiële scoringsvoorschrift.\n\n` +
    `REGELS:\n` +
    `1. Ken een scoringspunt ALLEEN toe als de leerling de inhoud ervan echt heeft ` +
    `gegeven. Twijfel je, dan niet toekennen.\n` +
    `2. Beoordeel de INHOUD, niet de spelling of de exacte formulering. Synoniemen en ` +
    `eigen bewoordingen zijn goed als de betekenis klopt.\n` +
    `3. Verzin geen scoringspunten buiten de rubric. De maximale score is de som van ` +
    `de rubriekpunten.\n` +
    `4. Feedback is kort, concreet en in het Nederlands, gericht op deze leerling ` +
    `("je ..."). Bij een gemist punt: zeg wat ontbrak.\n` +
    `5. Schrijf feedback met gewone leestekens; gebruik nooit een gedachtestreepje (—).\n` +
    `6. Antwoord UITSLUITEND met één geldig JSON-object, zonder tekst eromheen.`;
  const antwoordBlok = p.image
    ? `ANTWOORD VAN DE LEERLING: dit staat op de bijgevoegde foto (handgeschreven). Lees de foto zorgvuldig, negeer doorhalingen, en beoordeel wat de leerling uiteindelijk bedoelt. Kun je iets echt niet lezen, ken dat scoringspunt dan niet toe.`
    : `ANTWOORD VAN DE LEERLING:\n${p.leerlingantwoord || "(geen antwoord gegeven)"}`;
  const user =
    `VRAAG:\n${p.vraag}\n\n` +
    (p.context ? `CONTEXT:\n${p.context}\n\n` : "") +
    `MODELANTWOORD:\n${p.modelantwoord}\n\n` +
    `SCORINGSVOORSCHRIFT:\n${rubric}\n\n` +
    `${antwoordBlok}\n\n` +
    `Geef JSON in exact deze vorm:\n` +
    `{"points":[{"id":<nummer>,"earned":<true|false>,"feedback":"<kort>"}],` +
    `"summary":"<1 zin>","improvement_tip":"<1 concrete tip>"}`;
  return { system, user };
}

// Zet een data-URL (data:image/jpeg;base64,...) om naar een Anthropic image-block.
function parseImage(v: any): { media_type: string; data: string } | null {
  if (!v || typeof v !== "string") return null;
  const m = v.match(/^data:(image\/(?:jpeg|jpg|png|webp|gif));base64,([A-Za-z0-9+/=\s]+)$/i);
  if (!m) return null;
  const media = m[1].toLowerCase() === "image/jpg" ? "image/jpeg" : m[1].toLowerCase();
  const data = m[2].replace(/\s+/g, "");
  if (data.length < 100 || data.length > 7_000_000) return null; // ~5MB base64
  return { media_type: media, data };
}

function extractJson(text: string): any | null {
  if (!text) return null;
  const s = text.indexOf("{");
  const e = text.lastIndexOf("}");
  if (s < 0 || e <= s) return null;
  try { return JSON.parse(text.slice(s, e + 1)); } catch { return null; }
}

type Result = { status: number; body: any; charged: boolean };

async function handleGrade(p: any): Promise<Result> {
  if (!p || !Array.isArray(p.punten) || !p.punten.length) {
    return { status: 400, body: { error: "punten (rubriek) ontbreekt" }, charged: false };
  }
  const key = Deno.env.get("ANTHROPIC_API_KEY");
  if (!key) return { status: 500, body: { error: "server niet geconfigureerd" }, charged: false };

  const { system, user } = buildGradePrompt(p);
  const maxScore = p.punten.reduce((a: number, d: any) => a + (d.pts || 0), 0);

  // Foto-nakijken (#6): staat er een leesbare foto bij, dan sturen we die als
  // image-block mee zodat het model het handgeschreven antwoord zelf leest.
  const img = parseImage(p.image);
  const content: any = img
    ? [{ type: "image", source: { type: "base64", media_type: img.media_type, data: img.data } }, { type: "text", text: user }]
    : user;

  let resp: Response;
  try {
    resp = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 700,
        system,
        messages: [{ role: "user", content }],
      }),
    });
  } catch {
    return { status: 502, body: { error: "AI onbereikbaar" }, charged: false };
  }
  if (!resp.ok) return { status: 502, body: { error: "AI-fout", status: resp.status }, charged: false };

  const data = await resp.json().catch(() => null);
  const text = data?.content?.[0]?.text || "";
  const parsed = extractJson(text);
  if (!parsed || !Array.isArray(parsed.points)) {
    return { status: 502, body: { error: "AI gaf geen geldige beoordeling" }, charged: false };
  }

  // Normaliseer + valideer tegen de rubriek (server bepaalt de score, niet het model).
  const points = p.punten.map((d: any) => {
    const m = parsed.points.find((x: any) => String(x.id) === String(d.id)) || {};
    return {
      id: d.id,
      pts: d.pts,
      earned: m.earned === true,
      feedback: typeof m.feedback === "string" ? m.feedback.slice(0, 400) : "",
    };
  });
  const score = points.reduce((a, x) => a + (x.earned ? x.pts : 0), 0);

  return {
    status: 200,
    charged: true,
    body: {
      score,
      max_score: maxScore,
      points,
      summary: typeof parsed.summary === "string" ? parsed.summary.slice(0, 400) : "",
      improvement_tip:
        typeof parsed.improvement_tip === "string" ? parsed.improvement_tip.slice(0, 400) : "",
      model: MODEL,
    },
  };
}

async function handleUitleg(p: any): Promise<Result> {
  const key = Deno.env.get("ANTHROPIC_API_KEY");
  if (!key) return { status: 500, body: { error: "server niet geconfigureerd" }, charged: false };
  const prompt =
    `Leg in maximaal 4 zinnen, in eenvoudig Nederlands en op de toon van een ` +
    `behulpzame examentrainer, het volgende uit voor een ${p.niveau || "havo/vwo"}-leerling` +
    `${p.vak ? ` (${p.vak})` : ""}. Schrijf met gewone leestekens, gebruik geen gedachtestreepjes (—):\n\n${p.vraag || p.begrip || ""}`;
  try {
    const resp = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: MODEL, max_tokens: 400, messages: [{ role: "user", content: prompt }] }),
    });
    if (!resp.ok) return { status: 502, body: { error: "AI-fout" }, charged: false };
    const data = await resp.json().catch(() => null);
    const text = data?.content?.[0]?.text || "";
    if (!text) return { status: 502, body: { error: "geen uitleg" }, charged: false };
    return { status: 200, body: { text }, charged: true };
  } catch {
    return { status: 502, body: { error: "AI onbereikbaar" }, charged: false };
  }
}

// Vonk-chat: een leergerichte, meerdere-beurten studiecoach. Krijgt de
// gesprekshistorie mee en antwoordt kort, helder en inhoudelijk op het niveau
// van de leerling.
async function handleChat(p: any): Promise<Result> {
  const key = Deno.env.get("ANTHROPIC_API_KEY");
  if (!key) return { status: 500, body: { error: "server niet geconfigureerd" }, charged: false };
  const msgs = Array.isArray(p.messages)
    ? p.messages
        .filter((m: any) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
        .slice(-12)
        .map((m: any) => ({ role: m.role, content: String(m.content).slice(0, 2000) }))
    : [];
  if (!msgs.length || msgs[msgs.length - 1].role !== "user") {
    return { status: 400, body: { error: "geen vraag" }, charged: false };
  }
  const niveau = p.niveau || "havo/vwo";
  const system =
    `Je bent Vonk, de slimme, geduldige studiecoach van Slagio voor het Nederlandse eindexamen` +
    `${p.vak ? ` ${p.vak}` : ""}. Je helpt een ${niveau}-leerling` +
    `${p.onderwerp ? ` met het onderwerp "${p.onderwerp}"` : ""}.\n\n` +
    `ZO ANTWOORD JE:\n` +
    `1. Leg helder en to-the-point uit, precies op het niveau van de leerling. Korte zinnen, een concreet voorbeeld erbij.\n` +
    `2. Ga inhoudelijk de diepte in: de leerling moet het echt snappen en er iets aan hebben. Geef de kern, niet alleen een definitie.\n` +
    `3. Hou het kort: rond de 120 woorden, tenzij de vraag echt meer vraagt. Geen omhaal, geen inleiding vooraf.\n` +
    `4. Je bent warm en bemoedigend, af en toe een klein grapje of een emoji - maar de uitleg staat altijd voorop; nooit quasi-leuk zonder inhoud.\n` +
    `5. Blijf bij de examenstof en het vak. Vraagt de leerling iets dat niets met leren te maken heeft, breng het vriendelijk terug naar de stof.\n` +
    `6. Sluit af en toe af met een mini-check ("Snap je deze stap?") of een concrete tip. Schrijf altijd in het Nederlands.\n` +
    `7. Schrijf met gewone leestekens. Gebruik NOOIT een gedachtestreepje (—); splits in plaats daarvan de zin op of gebruik een komma of dubbele punt.`;
  try {
    const resp = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: MODEL, max_tokens: 600, system, messages: msgs }),
    });
    if (!resp.ok) return { status: 502, body: { error: "AI-fout" }, charged: false };
    const data = await resp.json().catch(() => null);
    const text = data?.content?.[0]?.text || "";
    if (!text) return { status: 502, body: { error: "geen antwoord" }, charged: false };
    return { status: 200, body: { text }, charged: true };
  } catch {
    return { status: 502, body: { error: "AI onbereikbaar" }, charged: false };
  }
}

// Genereert verse meerkeuze-oefenvragen op een specifiek onderwerp, in
// examenstijl. De client kijkt zelf na (we sturen het juiste antwoord mee),
// dus één AI-call levert een hele set — schaalbaar en goedkoop.
async function handleGenerate(p: any): Promise<Result> {
  const key = Deno.env.get("ANTHROPIC_API_KEY");
  if (!key) return { status: 500, body: { error: "server niet geconfigureerd" }, charged: false };
  const niveau = p.niveau || "havo/vwo";
  const vak = (p.vak || "").toString().slice(0, 60);
  const onderwerp = (p.onderwerp || "").toString().slice(0, 200);
  if (!onderwerp) return { status: 400, body: { error: "geen onderwerp" }, charged: false };
  const aantal = Math.max(3, Math.min(8, parseInt(p.aantal) || 5));
  const voorbeelden = Array.isArray(p.voorbeelden)
    ? p.voorbeelden.filter((x: any) => typeof x === "string" && x.trim()).slice(0, 4).map((x: string) => x.slice(0, 300))
    : [];
  const vbBlok = voorbeelden.length
    ? `\n\nVOORBEELDVRAGEN (zelfde stijl en niveau; maak NIEUWE vragen, kopieer deze niet):\n${voorbeelden.map((v: string, i: number) => `${i + 1}. ${v}`).join("\n")}`
    : "";
  const system =
    `Je bent een ervaren docent${vak ? " " + vak : ""} die oefenvragen maakt voor het Nederlandse ${niveau}-eindexamen. ` +
    `Je maakt heldere meerkeuzevragen precies op examenniveau: niet te makkelijk, met plausibele afleiders die veelgemaakte fouten weerspiegelen. ` +
    `Schrijf de vragen, opties en uitleg met gewone leestekens; gebruik nooit een gedachtestreepje (—). ` +
    `Je antwoordt UITSLUITEND met geldige JSON, zonder enige tekst eromheen.`;
  const prompt =
    `Maak ${aantal} nieuwe meerkeuzevragen over het onderwerp "${onderwerp}"${vak ? ` voor ${vak}` : ""} (${niveau}).\n` +
    `Elke vraag heeft 4 opties met precies één juist antwoord. Voeg een korte uitleg (max 2 zinnen) toe waarom dat antwoord klopt.\n` +
    `Varieer de invalshoek en moeilijkheid. Schrijf in het Nederlands. Verwijs nooit naar een bron, tekst of afbeelding die niet is meegegeven.${vbBlok}\n\n` +
    `Antwoord met exact dit JSON-formaat en niets anders:\n` +
    `{"vragen":[{"v":"vraagtekst","o":["optie A","optie B","optie C","optie D"],"c":0,"uitleg":"waarom dit juist is"}]}\n` +
    `"c" is de index (0-3) van het juiste antwoord.`;
  try {
    const resp = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: MODEL, max_tokens: 1800, system, messages: [{ role: "user", content: prompt }] }),
    });
    if (!resp.ok) return { status: 502, body: { error: "AI-fout" }, charged: false };
    const data = await resp.json().catch(() => null);
    let text = data?.content?.[0]?.text || "";
    const m = text.match(/\{[\s\S]*\}/);
    if (m) text = m[0];
    let parsed: any = null;
    try { parsed = JSON.parse(text); } catch { return { status: 502, body: { error: "parse" }, charged: false }; }
    const vragen = Array.isArray(parsed?.vragen) ? parsed.vragen : [];
    const schoon = vragen
      .filter((q: any) => q && typeof q.v === "string" && Array.isArray(q.o) && q.o.length >= 2)
      .slice(0, aantal)
      .map((q: any) => {
        const opts = q.o.slice(0, 4).map((x: any) => String(x).slice(0, 240));
        return {
          v: String(q.v).slice(0, 500),
          o: opts,
          c: Math.max(0, Math.min(opts.length - 1, parseInt(q.c) || 0)),
          uitleg: typeof q.uitleg === "string" ? q.uitleg.slice(0, 300) : "",
        };
      })
      .filter((q: any) => q.o.length >= 2);
    if (!schoon.length) return { status: 502, body: { error: "geen vragen" }, charged: false };
    return { status: 200, body: { vragen: schoon }, charged: true };
  } catch {
    return { status: 502, body: { error: "AI onbereikbaar" }, charged: false };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "POST verwacht" }, 405);

  let body: any = null;
  try { body = await req.json(); } catch { return json({ error: "ongeldige body" }, 400); }
  const mode = body?.mode || "uitleg";

  // ── POORT 1: ingelogd? ──────────────────────────────────────────────────
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  const user = await getUser(token);
  if (!user) return json({ error: "auth", locked: true, reason: "login" }, 401);

  // ── POORT 2 + 3: Plus? en quotum vrij? ─────────────────────────────────
  const plus = await userIsPlus(user.id);
  const periode = isoWeekKey();
  const used = await usageCount(user.id, periode);
  const cap = plus ? WEEKLY_PLUS : WEEKLY_TRIAL;
  if (used >= cap) {
    return json({ limit: true, plus, used, cap, reason: plus ? "fairuse" : "trial_op" }, 200);
  }

  // ── AI-request ──────────────────────────────────────────────────────────
  const out: Result = mode === "grade" ? await handleGrade(body)
    : mode === "chat" ? await handleChat(body)
    : mode === "generate" ? await handleGenerate(body)
    : await handleUitleg(body);

  // Alleen een écht gelukte AI-call telt mee voor het quotum.
  if (out.charged) await usageInc(user.id, periode, used);

  return json(out.body, out.status);
});
