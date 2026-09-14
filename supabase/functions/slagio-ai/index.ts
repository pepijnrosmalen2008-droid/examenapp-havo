// ─────────────────────────────────────────────────────────────────────────
// slagio-ai  ·  Supabase Edge Function (Deno)
//
// De AI-laag van Slagio Plus. Twee taken via één endpoint (veld `mode`):
//   mode:"grade"   → een open examenvraag nakijken tegen het scoringsvoorschrift
//   mode:"uitleg"  → (bestaand) een korte persoonlijke uitleg genereren
//
// De API-key staat ALLEEN hier (Deno.env), nooit in de frontend. De backend is
// de bron van waarheid: usage-telling en fair use horen hier thuis, niet in de
// client. Geef altijd GESTRUCTUREERDE JSON terug zodat de app de UI betrouwbaar
// rendert (geen vrije tekst als resultaat).
//
// Deploy:  supabase functions deploy slagio-ai --no-verify-jwt
// Secrets: supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
// Zet daarna SLAGIO_AI_ENDPOINT in cloud.js op de functie-URL.
// ─────────────────────────────────────────────────────────────────────────

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-4-5"; // goedkoop + capabel; nakijken is een afgebakende taak

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
    `5. Antwoord UITSLUITEND met één geldig JSON-object, zonder tekst eromheen.`;
  const user =
    `VRAAG:\n${p.vraag}\n\n` +
    (p.context ? `CONTEXT:\n${p.context}\n\n` : "") +
    `MODELANTWOORD:\n${p.modelantwoord}\n\n` +
    `SCORINGSVOORSCHRIFT:\n${rubric}\n\n` +
    `ANTWOORD VAN DE LEERLING:\n${p.leerlingantwoord || "(geen antwoord gegeven)"}\n\n` +
    `Geef JSON in exact deze vorm:\n` +
    `{"points":[{"id":<nummer>,"earned":<true|false>,"feedback":"<kort>"}],` +
    `"summary":"<1 zin>","improvement_tip":"<1 concrete tip>"}`;
  return { system, user };
}

function extractJson(text: string): any | null {
  if (!text) return null;
  // Pak het eerste { ... } blok, ook als er per ongeluk tekst omheen staat.
  const s = text.indexOf("{");
  const e = text.lastIndexOf("}");
  if (s < 0 || e <= s) return null;
  try { return JSON.parse(text.slice(s, e + 1)); } catch { return null; }
}

async function handleGrade(p: any) {
  if (!p || !Array.isArray(p.punten) || !p.punten.length) {
    return json({ error: "punten (rubriek) ontbreekt" }, 400);
  }
  const key = Deno.env.get("ANTHROPIC_API_KEY");
  if (!key) return json({ error: "server niet geconfigureerd" }, 500);

  const { system, user } = buildGradePrompt(p);
  const maxScore = p.punten.reduce((a: number, d: any) => a + (d.pts || 0), 0);

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
        messages: [{ role: "user", content: user }],
      }),
    });
  } catch {
    return json({ error: "AI onbereikbaar" }, 502);
  }
  if (!resp.ok) return json({ error: "AI-fout", status: resp.status }, 502);

  const data = await resp.json().catch(() => null);
  const text = data?.content?.[0]?.text || "";
  const parsed = extractJson(text);
  if (!parsed || !Array.isArray(parsed.points)) {
    return json({ error: "AI gaf geen geldige beoordeling" }, 502);
  }

  // Normaliseer + valideer tegen de rubriek (server bepaalt de score, niet het model).
  const byId = new Map(p.punten.map((d: any) => [String(d.id), d]));
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

  return json({
    score,
    max_score: maxScore,
    points,
    summary: typeof parsed.summary === "string" ? parsed.summary.slice(0, 400) : "",
    improvement_tip:
      typeof parsed.improvement_tip === "string" ? parsed.improvement_tip.slice(0, 400) : "",
    model: MODEL,
  });
}

// (Bestaande) korte uitleg-modus, kort gehouden.
async function handleUitleg(p: any) {
  const key = Deno.env.get("ANTHROPIC_API_KEY");
  if (!key) return json({ error: "server niet geconfigureerd" }, 500);
  const prompt =
    `Leg in maximaal 4 zinnen, in eenvoudig Nederlands en op de toon van een ` +
    `behulpzame examentrainer, het volgende uit voor een ${p.niveau || "havo/vwo"}-leerling` +
    `${p.vak ? ` (${p.vak})` : ""}:\n\n${p.vraag || p.begrip || ""}`;
  try {
    const resp = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: MODEL, max_tokens: 400, messages: [{ role: "user", content: prompt }] }),
    });
    if (!resp.ok) return json({ error: "AI-fout" }, 502);
    const data = await resp.json().catch(() => null);
    const text = data?.content?.[0]?.text || "";
    if (!text) return json({ error: "geen uitleg" }, 502);
    return json({ text });
  } catch {
    return json({ error: "AI onbereikbaar" }, 502);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "POST verwacht" }, 405);
  let body: any = null;
  try { body = await req.json(); } catch { return json({ error: "ongeldige body" }, 400); }
  const mode = body?.mode || "uitleg";
  if (mode === "grade") return handleGrade(body);
  return handleUitleg(body);
});
