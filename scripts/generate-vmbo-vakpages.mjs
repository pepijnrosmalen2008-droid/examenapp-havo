// Genereert de VMBO GL/TL vak-landingspagina's (SEO) uit data-vmbo.meta.js.
// Eerlijk: VMBO-oefenvragen worden nog toegevoegd, dus we claimen GEEN
// vragenaantallen. We tonen wel de echte CE/SE-domeinen, examendata en
// hulpmiddelen - dat is waardevol en klopt.
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');

// laad VAKKEN_VMBO uit de meta (var-declaratie -> eval in een sandbox-functie)
const metaSrc = readFileSync(join(root, 'data-vmbo.meta.js'), 'utf8');
const VAKKEN_VMBO = new Function(metaSrc + '\nreturn VAKKEN_VMBO;')();

const SLUG = { nl: 'nederlands', en: 'engels', du: 'duits', fa: 'frans', wi: 'wiskunde', na1: 'natuur-scheikunde-1', na2: 'natuur-scheikunde-2', bi: 'biologie', ec: 'economie', gs: 'geschiedenis', ak: 'aardrijkskunde', ma: 'maatschappijkunde' };
const EMOJI = { nl: '📖', en: '🇬🇧', du: '🇩🇪', fa: '🇫🇷', wi: '📐', na1: '⚗️', na2: '🔬', bi: '🌿', ec: '💶', gs: '🏛️', ak: '🌍', ma: '⚖️' };
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const jesc = s => String(s == null ? '' : s).replace(/\\/g, '\\\\').replace(/"/g, '\\"');

function page(v) {
  const slug = SLUG[v.id] || v.id;
  const file = `vmbo-${slug}`;
  const url = `https://slagio.nl/vakken/${file}.html`;
  const accent = v.kleur || '#16a34a';
  const doms = v.domeinen || [];
  const ceDoms = doms.filter(d => (d.ceStatus || '').includes('CE'));
  const naam = v.naam;
  const emoji = EMOJI[v.id] || '📘';

  const domList = doms.map(d => {
    const tag = (d.ceStatus || '').includes('CE') ? '<span style="color:' + accent + ';font-weight:700">CE</span>' : '<span style="color:var(--text-muted)">SE</span>';
    return `      <li><strong>${esc(d.naam)}</strong> <span style="opacity:.7">(${esc(d.code || d.id)})</span> · ${tag}<br><span style="font-size:.9em">${esc(d.beschrijving || '')}</span></li>`;
  }).join('\n');

  const ceNamen = ceDoms.map(d => `${d.naam} (${d.code || d.id})`).join(', ') || 'zie het examenprogramma';
  const examZin = `1e tijdvak ${v.exDatum ? 'op ' + esc(v.exDatum) : 'in 2027'}${v.exTijd ? ', ' + esc(v.exTijd) : ''}${v.exDuur ? ' (' + esc(v.exDuur) + ')' : ''}.`;

  const faqs = [
    [`Wat zijn de CE-domeinen voor ${naam} VMBO?`, `De centraal-examendomeinen voor ${naam} VMBO GL/TL zijn: ${ceNamen}. De overige domeinen zijn schoolexamen (SE).`],
    [`Wanneer is het ${naam} VMBO examen 2027?`, `Het centraal examen ${naam} VMBO GL/TL valt in het eerste tijdvak ${v.exDatum ? 'op ' + v.exDatum : 'in mei 2027'}${v.exDuur ? '. Het examen duurt ' + v.exDuur : ''}.`],
    [`Welke hulpmiddelen mag ik gebruiken bij ${naam} VMBO?`, v.hulpmiddelen ? `Toegestaan bij ${naam} VMBO: ${v.hulpmiddelen}.` : `Kijk voor de toegestane hulpmiddelen bij ${naam} VMBO in de examenregeling op examenblad.nl.`]
  ];
  const faqJson = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };

  const others = VAKKEN_VMBO.filter(o => o.id !== v.id).slice(0, 4);
  const cross = others.map(o => `<a href="/vakken/vmbo-${SLUG[o.id] || o.id}.html">${esc(o.naam)} VMBO</a>`).join(' &nbsp;·&nbsp; ');

  return `<!DOCTYPE html>
<html lang="nl" data-vak="${v.id}">
<head>
<script>/* Slagio-boot-spa: echte bezoekers openen de vak-pagina in de app (openVak); zoekmachine-crawlers zien de statische SEO-pagina (SEO behouden) */
(function(){try{if(/bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegram|slackbot|discord|embedly|quora|pinterest|linkedin|bingpreview/i.test(navigator.userAgent))return;var id=document.documentElement.getAttribute("data-vak");var m=location.pathname.match(/\\/vakken\\/(havo|vwo|vmbo)-.*?(?:-domein-([a-z]))?\\.html$/);if(!id||!m)return;location.replace("/?niveau="+m[1]+"&vak="+id+(m[2]?"&domein="+m[2].toUpperCase():""));}catch(e){}})();
</script>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(naam)} VMBO (GL/TL) Eindexamen 2027 - Gratis oefenen | Slagio</title>
  <meta name="description" content="${esc(naam)} VMBO GL/TL eindexamen 2027: alle CE- en SE-domeinen, examendata en hulpmiddelen overzichtelijk op een rij. Gratis oefenen op Slagio.nl, geen account nodig.">
  <meta property="og:title" content="${esc(naam)} VMBO Eindexamen 2027 - Slagio">
  <meta property="og:description" content="Alle examendomeinen, data en hulpmiddelen voor ${esc(naam)} VMBO GL/TL 2027. Gratis oefenen op Slagio.">
  <meta property="og:url" content="${url}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://slagio.nl/icon-512.png">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "${jesc(naam)} VMBO Examenvoorbereiding 2027",
    "description": "Gratis online examenvoorbereiding voor ${jesc(naam)} VMBO GL/TL eindexamen 2027",
    "provider": {"@type": "Organization", "name": "Slagio", "url": "https://slagio.nl"},
    "isAccessibleForFree": true,
    "educationalLevel": "VMBO GL/TL",
    "inLanguage": "nl"
  }
  </script>
  <script type="application/ld+json">
${JSON.stringify(faqJson, null, 2)}
  </script>
  <script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Slagio", "item": "https://slagio.nl/"},
    {"@type": "ListItem", "position": 2, "name": "Vakken", "item": "https://slagio.nl/vakken/"},
    {"@type": "ListItem", "position": 3, "name": "${jesc(naam)} VMBO", "item": "${url}"}
  ]
}
  </script>
  <link rel="canonical" href="${url}">
  <link rel="icon" href="/icon-192.png">
  <style>
    :root{--bg:#0f1724;--bg-card:#1a2332;--text:#e4e8ef;--text-muted:#8896a8;--accent:${accent};--border:#2a3444}
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:var(--bg);color:var(--text);line-height:1.6}
    .container{max-width:800px;margin:0 auto;padding:2rem 1.5rem}
    .header{text-align:center;margin-bottom:2.5rem}
    .header img{width:48px;height:48px;margin-bottom:1rem;border-radius:12px}
    .header h1{font-size:2rem;margin-bottom:.5rem}
    .header h1 span{color:var(--accent)}
    .header p{color:var(--text-muted);font-size:1.1rem}
    .stats{display:flex;gap:2rem;justify-content:center;margin:2rem 0;flex-wrap:wrap}
    .stat{text-align:center}
    .stat-number{font-size:1.8rem;font-weight:800;color:var(--accent)}
    .stat-label{font-size:.85rem;color:var(--text-muted)}
    .cta{display:inline-block;background:var(--accent);color:#fff;padding:1rem 2.5rem;border-radius:12px;text-decoration:none;font-weight:700;font-size:1.1rem;margin:1.5rem 0;transition:opacity .2s}
    .cta:hover{opacity:.85}
    .card{background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:1.5rem;margin-bottom:1.5rem}
    .card h2{font-size:1.3rem;margin-bottom:1rem}
    .domain-list{list-style:none}
    .domain-list li{padding:.75rem 0;border-bottom:1px solid var(--border);color:var(--text-muted)}
    .domain-list li:last-child{border-bottom:none}
    .domain-list strong{color:var(--text)}
    .features{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1rem;margin:1.5rem 0}
    .feature{text-align:center;padding:1rem}
    .feature-icon{font-size:2rem;margin-bottom:.5rem}
    .feature-title{font-weight:600;margin-bottom:.25rem}
    .feature p{color:var(--text-muted);font-size:.9rem}
    .note{background:rgba(255,255,255,.04);border:1px dashed var(--border);border-radius:10px;padding:.9rem 1rem;color:var(--text-muted);font-size:.92rem;margin-top:1rem}
    .footer{text-align:center;color:var(--text-muted);font-size:.85rem;margin-top:3rem;padding-top:2rem;border-top:1px solid var(--border)}
    .footer a{color:var(--accent);text-decoration:none}
    .card a{color:var(--accent);text-decoration:none}
    .card a:hover{text-decoration:underline}
    .exam-info p{color:var(--text-muted);margin-top:.35rem}
    .exam-info strong{color:var(--text)}
    @media(max-width:600px){.header h1{font-size:1.5rem}.stats{gap:1rem}}
  </style>
  <link rel="stylesheet" href="vak-theme.css">
</head>
<body>
<div class="container">
  <div class="header">
    <a href="https://slagio.nl"><img src="/icon-192.png" alt="Slagio logo"></a>
    <h1><span>${esc(naam)}</span> VMBO Eindexamen 2027</h1>
    <p>Alle examendomeinen, data en hulpmiddelen op een rij ${emoji}</p>
  </div>

  <div class="stats">
    <div class="stat"><div class="stat-number">${doms.length}</div><div class="stat-label">Examendomeinen</div></div>
    <div class="stat"><div class="stat-number">${ceDoms.length}</div><div class="stat-label">CE-domeinen</div></div>
    <div class="stat"><div class="stat-number">Gratis</div><div class="stat-label">Geen account</div></div>
  </div>

  <div style="text-align:center">
    <a href="https://slagio.nl/?niveau=vmbo&amp;vak=${v.id}" class="cta">Open ${esc(naam)} in Slagio →</a>
  </div>

  <div class="card">
    <h2>Examendomeinen ${esc(naam)} VMBO GL/TL</h2>
    <ul class="domain-list">
${domList}
    </ul>
    ${v.ceInfo ? `<p style="color:var(--text-muted);margin-top:1rem;font-size:.92rem">${esc(v.ceInfo)}</p>` : ''}
  </div>

  <div class="card exam-info">
    <h2>📅 Examen ${esc(naam)} VMBO 2027</h2>
    <p>${examZin}</p>
    ${v.hulpmiddelen ? `<p>Hulpmiddelen: <strong>${esc(v.hulpmiddelen)}</strong></p>` : ''}
  </div>

  <div class="card">
    <h2>Hoe werkt Slagio?</h2>
    <div class="features">
      <div class="feature"><div class="feature-icon">📝</div><div class="feature-title">Snelle quiz</div><p>Korte oefensessies per domein</p></div>
      <div class="feature"><div class="feature-icon">🃏</div><div class="feature-title">Flashcards</div><p>Begrippen met herhaling</p></div>
      <div class="feature"><div class="feature-icon">📊</div><div class="feature-title">Voortgang</div><p>Zie per domein hoe je ervoor staat</p></div>
      <div class="feature"><div class="feature-icon">📄</div><div class="feature-title">Examenstof</div><p>Alle CE- en SE-domeinen</p></div>
    </div>
    <div class="note">De oefenvragen voor VMBO GL/TL worden op dit moment toegevoegd. De examenstructuur, domeinen en data hierboven zijn al volledig beschikbaar in de app.</div>
  </div>

  <div style="text-align:center;margin-top:1rem">
    <a href="https://slagio.nl/?niveau=vmbo&amp;vak=${v.id}" class="cta">Gratis beginnen →</a>
    <p style="color:var(--text-muted);margin-top:.5rem">Geen account nodig &middot; 100% gratis &middot; Offline beschikbaar</p>
  </div>

  <div class="card" style="margin-top:1.5rem">
    <h2>Andere VMBO-vakken op Slagio</h2>
    <p style="color:var(--text-muted);font-size:.95rem;line-height:2">${cross}</p>
  </div>

  <div class="footer">
    <p>&copy; 2027 Slagio &middot; <a href="https://slagio.nl">slagio.nl</a> &middot; <a href="https://www.examenblad.nl">examenblad.nl</a></p>
    <p style="margin-top:.5rem"><a href="/vakken/">Alle vakpagina's</a></p>
  </div>
</div>
</body>
</html>
`;
}

const dropdown = [];
for (const v of VAKKEN_VMBO) {
  const slug = SLUG[v.id] || v.id;
  const file = `vmbo-${slug}.html`;
  writeFileSync(join(root, 'vakken', file), page(v));
  dropdown.push(`<a href="/vakken/${file}">${v.naam} VMBO</a>`);
  console.log('wrote vakken/' + file);
}
console.log('\n--- DROPDOWN LINKS ---\n<strong style="color:var(--mu)">VMBO GL/TL</strong><br>' + dropdown.join('<br>'));
