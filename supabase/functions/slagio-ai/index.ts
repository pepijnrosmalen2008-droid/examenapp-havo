// Slagio AI — uitleg-bij-een-fout (Edge Function, Deno)
// ─────────────────────────────────────────────────────────────────────────────
// Zit bovenop Slagio's kennisstructuur: de client stuurt vak/domein, de vraag,
// het gekozen + juiste antwoord en de canonieke uitleg (uo/uh) mee. Deze functie
// vraagt Claude om een korte, pedagogische uitleg op het niveau van de leerling —
// hint-eerst, niet "hier is het antwoord". De API-sleutel blijft server-side.
//
// Deploy:  supabase functions deploy slagio-ai --no-verify-jwt
// Secret:  supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
// Zet daarna SLAGIO_AI_ENDPOINT in cloud.js op de functie-URL (zie README.md).

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY") ?? "";
const MODEL = Deno.env.get("SLAGIO_AI_MODEL") ?? "claude-opus-5"; // Haiku 4.5 is veel goedkoper voor deze korte hints
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, content-type",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, "content-type": "application/json" } });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  if (!ANTHROPIC_API_KEY) return json({ error: "no_api_key" }, 500);

  let p: Record<string, string> = {};
  try { p = await req.json(); } catch { return json({ error: "bad_json" }, 400); }

  const niveau = (p.niveau || "").toString().toUpperCase();
  const system =
    `Je bent Vonk, de studiecoach van Slagio. Je legt een ${niveau || "middelbare-school"}-leerling ` +
    `uit waarom hun antwoord op een examenvraag niet klopt. Regels:\n` +
    `- Schrijf in het Nederlands, warm en bondig (max ~120 woorden).\n` +
    `- Begin bij wat de leerling waarschijnlijk dacht en waar de denkfout zit — geef niet meteen kaal het antwoord.\n` +
    `- Leg dan uit waaróm het juiste antwoord klopt, in één heldere stap.\n` +
    `- Sluit af met één "Onthoud"-zin.\n` +
    `- Bouw voort op de meegegeven canonieke uitleg; verzin geen nieuwe feiten.\n` +
    `- Geen opsomming van alle opties, geen aanhef/afsluiting zoals "Hoi" of "Groetjes".`;

  const user =
    `Vak: ${p.vak || "-"} · Domein: ${p.domein || "-"}\n` +
    `Vraag: ${p.vraag || "-"}\n` +
    `Antwoord van de leerling: ${p.gekozen || "-"}\n` +
    `Juiste antwoord: ${p.juist || "-"}\n` +
    (p.waarom ? `Canonieke uitleg (waarom fout): ${p.waarom}\n` : "") +
    (p.onthoud ? `Kernpunt: ${p.onthoud}\n` : "") +
    `\nLeg uit waarom het antwoord van de leerling niet klopt.`;

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 600,
        output_config: { effort: "low" }, // korte hint → laag effort houdt het snel en goedkoop
        system,
        messages: [{ role: "user", content: user }],
      }),
    });

    if (!r.ok) {
      const detail = await r.text().catch(() => "");
      return json({ error: "upstream", status: r.status, detail: detail.slice(0, 300) }, 502);
    }
    const data = await r.json();
    if (data.stop_reason === "refusal") return json({ error: "refused" }, 200);
    const text = (data.content || [])
      .filter((b: { type: string }) => b.type === "text")
      .map((b: { text: string }) => b.text)
      .join("\n")
      .trim();
    if (!text) return json({ error: "empty" }, 200);
    return json({ text });
  } catch (e) {
    return json({ error: "exception", detail: String(e).slice(0, 200) }, 500);
  }
});
