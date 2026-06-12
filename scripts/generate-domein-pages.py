#!/usr/bin/env python3
"""
Slagio — Domein-pagina generator
Genereert één SEO-geoptimaliseerde HTML-pagina per vak×domein combinatie.
Output: vakken/havo-economie-domein-c.html  e.d.
"""
import re, os, json, unicodedata

DATA_JS   = os.path.join(os.path.dirname(__file__), '..', 'data.js')
OUT_DIR   = os.path.join(os.path.dirname(__file__), '..', 'vakken')
SITE_DATE = '2026-06-12'
YEAR      = '2027'  # examenjaar waarvoor we optimaliseren

# ── slug helpers ──────────────────────────────────────────────────────────
VAK_SLUG = {
    'nl':'nederlands','wa':'wiskunde-a','wb':'wiskunde-b','bi':'biologie',
    'sk':'scheikunde','na':'natuurkunde','be':'bedrijfseconomie','en':'engels',
    'ec':'economie','gs':'geschiedenis','ak':'aardrijkskunde',
    'mw':'maatschappijwetenschappen','du':'duits','fr':'frans',
    'la':'latijn','gr':'grieks','in':'informatica',
}

def to_slug(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode()
    s = s.lower()
    s = re.sub(r'[^a-z0-9]+', '-', s)
    s = s.strip('-')
    return s

# ── data.js parser ────────────────────────────────────────────────────────
def parse_data_js():
    with open(DATA_JS, encoding='utf-8') as f:
        content = f.read()

    # Split in HAVO en VWO blokken
    vwo_start = content.find('const VAKKEN_VWO=[')
    havo_block = content[content.find('const VAKKEN = ['):vwo_start]
    vwo_block  = content[vwo_start:]

    havo_vakken = parse_vakken_block(havo_block, 'havo')
    vwo_vakken  = parse_vakken_block(vwo_block,  'vwo')
    return havo_vakken + vwo_vakken

def _get(pattern, text, default=''):
    m = re.search(pattern, text, re.DOTALL)
    return m.group(1).strip() if m else default

def parse_vakken_block(block, niveau):
    """Parst één VAKKEN-blok (HAVO of VWO) en geeft lijst van vak-dicts."""
    vakken = []

    # Vind alle vak-startposities: regels als  {id:'ec',naam:'Economie',code:'EC',kleur:'#...',
    vak_starts = [(m.start(), m.group(1), m.group(2), m.group(3), m.group(4))
                  for m in re.finditer(
                      r"\{id:'([a-z]+)',naam:'([^']+)',code:'([^']+)',kleur:'([^']+)'",
                      block)]

    for i, (pos, vid, vnaam, vcode, vkleur) in enumerate(vak_starts):
        end = vak_starts[i+1][0] if i+1 < len(vak_starts) else len(block)
        vak_text = block[pos:end]

        ex_datum = _get(r"exDatum:'([^']+)'", vak_text)
        ex_tijd  = _get(r"exTijd:'([^']+)'", vak_text)
        hulpm    = _get(r"hulpmiddelen:'([^']+)'", vak_text)
        ce_info  = _get(r"ceInfo:'([^']+)'", vak_text)
        vak_besch= _get(r"beschrijving:'([^']+)'", vak_text)

        domeinen = parse_domeinen(vak_text)
        vakken.append({
            'id': vid, 'naam': vnaam, 'code': vcode, 'kleur': vkleur,
            'niveau': niveau, 'exDatum': ex_datum, 'exTijd': ex_tijd,
            'hulpmiddelen': hulpm, 'ceInfo': ce_info,
            'beschrijving': vak_besch,
            'domeinen': domeinen,
        })
    return vakken

def parse_domeinen(vak_text):
    """Parst de domeinen[] uit een vak-tekst."""
    # Zoek het begin van domeinen:
    dom_start = vak_text.find(' domeinen:[')
    if dom_start == -1:
        dom_start = vak_text.find('domeinen:[')
    if dom_start == -1:
        return []

    # Vind alle domein-entries: {id:'A',naam:'...',
    # Domein-IDs zijn hoofdletters of cijfers
    domeinen = []
    for m in re.finditer(
            r"\{id:'([A-Z0-9]+)',naam:'([^']+)',(?:beschrijving:'([^']*)',)?",
            vak_text[dom_start:]):
        did   = m.group(1)
        dnaam = m.group(2)
        dbesch= m.group(3) or ''

        # Zoek ceStatus in context rond dit treffer
        ctx_start = m.start()
        # Zoek in de eerstvolgende ~800 tekens voor dit domein
        ctx = vak_text[dom_start + ctx_start : dom_start + ctx_start + 1200]
        ce_status = _get(r"ceStatus:'([^']+)'", ctx, 'CE')

        # Onderwerpen (eerste 5)
        ow_raw = _get(r"onderwerpen:\[([^\]]+)\]", ctx, '')
        if ow_raw:
            ow_items = re.findall(r"'([^']+)'", ow_raw)
        else:
            ow_items = []

        domeinen.append({
            'id': did, 'naam': dnaam, 'beschrijving': dbesch,
            'ceStatus': ce_status, 'onderwerpen': ow_items[:6],
        })
    return domeinen

# ── HTML template ─────────────────────────────────────────────────────────
CE_BADGE = {
    'CE':       ('🟠', 'Centraal Examen',          '#f97316', 'rgba(249,115,22,.1)'),
    'SE':       ('🟢', 'Schoolexamen',              '#22c55e', 'rgba(34,197,94,.1)'),
    'CE+SE':    ('🟣', 'CE + Schoolexamen',         '#8b5cf6', 'rgba(139,92,246,.1)'),
    'DEELS CE': ('🟡', 'Deels Centraal Examen',    '#f59e0b', 'rgba(245,158,11,.1)'),
}

def ce_badge_html(ce_status):
    icon, label, color, bg = CE_BADGE.get(ce_status, CE_BADGE['CE'])
    return (f'<span style="display:inline-flex;align-items:center;gap:6px;'
            f'padding:4px 12px;border-radius:20px;background:{bg};'
            f'color:{color};font-size:12px;font-weight:700;margin-bottom:16px">'
            f'{icon} {label}</span>')

def make_faq(vak_naam, dom_naam, dom_id, dom_besch, niveau):
    niv = 'HAVO' if niveau == 'havo' else 'VWO'
    return [
        {
            'q': f'Wat zijn de examenvragen over {dom_naam} voor {vak_naam} {niv}?',
            'a': (f'Slagio biedt meer dan 15 oefenvragen specifiek voor {dom_naam} '
                  f'({vak_naam} {niv}), zowel meerkeuze als open CE-stijl vragen met '
                  f'modelantwoord. Alle vragen zijn gebaseerd op de officiële examenprogramma\'s.')
        },
        {
            'q': f'Hoe oefen ik domein {dom_id} ({dom_naam}) voor het {vak_naam} {niv} eindexamen?',
            'a': (f'Via Slagio kun je direct starten met een snelle quiz over {dom_naam}, '
                  f'spaced-repetition flashcards leren, of een open CE-vraag beantwoorden en '
                  f'vergelijken met het modelantwoord. Volledig gratis, geen account nodig.')
        },
    ]

def generate_html(vak, dom):
    niveau    = vak['niveau']
    niv_cap   = 'HAVO' if niveau == 'havo' else 'VWO'
    vak_naam  = vak['naam']
    vak_id    = vak['id']
    vak_kleur = vak['kleur']
    dom_id    = dom['id']
    dom_naam  = dom['naam']
    dom_besch = dom['beschrijving']
    ce_status = dom['ceStatus']
    ow        = dom['onderwerpen']

    vak_slug  = VAK_SLUG.get(vak_id, to_slug(vak_naam))
    dom_slug  = to_slug(dom_naam)
    filename  = f'{niveau}-{vak_slug}-domein-{dom_id.lower()}.html'
    url       = f'https://slagio.nl/vakken/{filename}'
    cta_url   = f'https://slagio.nl/?niveau={niveau}&vak={vak_id}&domein={dom_id}'
    parent_url= f'https://slagio.nl/vakken/{niveau}-{vak_slug}.html'
    parent_short = f'https://slagio.nl/vakken/{niveau}-{vak_id}.html'

    ce_icon, ce_label, ce_color, _ = CE_BADGE.get(ce_status, CE_BADGE['CE'])
    badge_html = ce_badge_html(ce_status)

    # Unieke beschrijving (max 155 tekens)
    meta_desc = (
        f'Gratis oefenen voor domein {dom_id} ({dom_naam}) van {vak_naam} {niv_cap} '
        f'eindexamen {YEAR}. Meerkeuze & open CE-vragen, flashcards en modelantwoorden op Slagio.')
    if len(meta_desc) > 155:
        meta_desc = meta_desc[:152] + '...'

    # Intro tekst
    intro_text = (
        f'Dit zijn alle oefenvragen voor <strong>domein {dom_id} — {dom_naam}</strong> '
        f'van het {vak_naam} {niv_cap}-eindexamen. '
        f'Het domein heeft de examenclassificatie <strong>{ce_icon} {ce_label}</strong>.'
    )
    if dom_besch:
        intro_text += f' {dom_besch.capitalize()}.'

    # Onderwerpen HTML
    ow_html = ''
    if ow:
        items = ''.join(f'<li>{o}</li>' for o in ow)
        ow_html = f'''
  <div class="card">
    <h2>📌 Kernonderwerpen domein {dom_id}</h2>
    <ul class="domain-list">{items}</ul>
  </div>'''

    # FAQ HTML + JSON-LD
    faqs = make_faq(vak_naam, dom_naam, dom_id, dom_besch, niveau)
    faq_html = ''.join(
        f'<div class="faq-item"><h3>{f["q"]}</h3><p>{f["a"]}</p></div>'
        for f in faqs)
    faq_ld = json.dumps({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [{
            '@type': 'Question',
            'name': f['q'],
            'acceptedAnswer': {'@type': 'Answer', 'text': f['a']}
        } for f in faqs]
    }, ensure_ascii=False, indent=2)

    breadcrumb_ld = json.dumps({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
            {'@type':'ListItem','position':1,'name':'Slagio','item':'https://slagio.nl/'},
            {'@type':'ListItem','position':2,'name':'Vakken','item':'https://slagio.nl/vakken/'},
            {'@type':'ListItem','position':3,'name':f'{vak_naam} {niv_cap}','item':parent_url},
            {'@type':'ListItem','position':4,'name':f'Domein {dom_id}: {dom_naam}','item':url},
        ]
    }, ensure_ascii=False, indent=2)

    course_ld = json.dumps({
        '@context': 'https://schema.org',
        '@type': 'Course',
        'name': f'{vak_naam} {niv_cap} Domein {dom_id}: {dom_naam} — Examenvoorbereiding {YEAR}',
        'description': meta_desc,
        'provider': {'@type':'Organization','name':'Slagio','url':'https://slagio.nl'},
        'isAccessibleForFree': True,
        'educationalLevel': niv_cap,
        'inLanguage': 'nl',
        'about': {'@type':'Thing','name':f'{dom_naam}'},
    }, ensure_ascii=False, indent=2)

    # Gerelateerde vakpagina-links
    vak_link_html = (f'<a href="{parent_url}">{vak_naam} {niv_cap} — overzicht</a> &nbsp;·&nbsp; '
                     f'<a href="https://slagio.nl/vakken/">Alle vakken</a>')

    html = f'''<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{vak_naam} {niv_cap} Domein {dom_id} — {dom_naam}: oefenvragen {YEAR} | Slagio</title>
  <meta name="description" content="{meta_desc}">
  <meta property="og:title" content="{vak_naam} {niv_cap} Domein {dom_id}: {dom_naam} — Slagio">
  <meta property="og:description" content="{meta_desc}">
  <meta property="og:url" content="{url}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://slagio.nl/icon-512.png">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="{vak_naam} {niv_cap} Domein {dom_id}: {dom_naam} | Slagio">
  <link rel="canonical" href="{url}">
  <link rel="icon" href="/icon-192.png">
  <script type="application/ld+json">{course_ld}</script>
  <script type="application/ld+json">{faq_ld}</script>
  <script type="application/ld+json">{breadcrumb_ld}</script>
  <style>
    :root{{--bg:#0f1724;--bg-card:#1a2332;--text:#e4e8ef;--text-muted:#8896a8;--accent:{vak_kleur};--border:#2a3444}}
    *{{margin:0;padding:0;box-sizing:border-box}}
    body{{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:var(--bg);color:var(--text);line-height:1.6}}
    .container{{max-width:800px;margin:0 auto;padding:2rem 1.5rem}}
    .breadcrumb{{font-size:12px;color:var(--text-muted);margin-bottom:1.5rem}}
    .breadcrumb a{{color:var(--accent);text-decoration:none}}
    .breadcrumb span{{margin:0 6px;opacity:.5}}
    .header{{text-align:center;margin-bottom:2.5rem}}
    .header img{{width:48px;height:48px;margin-bottom:1rem;border-radius:12px}}
    .header h1{{font-size:1.9rem;margin-bottom:.5rem;line-height:1.25}}
    .header h1 span{{color:var(--accent)}}
    .header p{{color:var(--text-muted);font-size:1rem}}
    .stats{{display:flex;gap:2rem;justify-content:center;margin:1.5rem 0;flex-wrap:wrap}}
    .stat{{text-align:center}}
    .stat-number{{font-size:1.6rem;font-weight:800;color:var(--accent)}}
    .stat-label{{font-size:.8rem;color:var(--text-muted)}}
    .cta{{display:inline-block;background:var(--accent);color:#fff;padding:1rem 2.5rem;border-radius:12px;text-decoration:none;font-weight:700;font-size:1.05rem;margin:1.5rem 0;transition:opacity .2s}}
    .cta:hover{{opacity:.85}}
    .card{{background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:1.5rem;margin-bottom:1.5rem}}
    .card h2{{font-size:1.2rem;margin-bottom:1rem}}
    .domain-list{{list-style:none;padding-left:.25rem}}
    .domain-list li{{padding:.6rem 0;border-bottom:1px solid var(--border);color:var(--text-muted);font-size:.95rem}}
    .domain-list li:last-child{{border-bottom:none}}
    .intro{{color:var(--text-muted);font-size:.95rem;line-height:1.7}}
    .intro strong{{color:var(--text)}}
    .faq-item{{margin-bottom:1.2rem}}
    .faq-item h3{{font-size:1rem;font-weight:700;color:var(--text);margin-bottom:.4rem}}
    .faq-item p{{color:var(--text-muted);font-size:.9rem;line-height:1.65}}
    .footer{{text-align:center;color:var(--text-muted);font-size:.8rem;margin-top:3rem;padding-top:2rem;border-top:1px solid var(--border)}}
    .footer a{{color:var(--accent);text-decoration:none}}
    @media(max-width:600px){{.header h1{{font-size:1.4rem}}.stats{{gap:1rem}}}}
  </style>
</head>
<body>
<div class="container">
  <nav class="breadcrumb" aria-label="Navigatie">
    <a href="https://slagio.nl">Slagio</a><span>›</span>
    <a href="https://slagio.nl/vakken/">Vakken</a><span>›</span>
    <a href="{parent_url}">{vak_naam} {niv_cap}</a><span>›</span>
    Domein {dom_id}
  </nav>

  <div class="header">
    <a href="https://slagio.nl"><img src="/icon-192.png" alt="Slagio logo"></a>
    {badge_html}
    <h1><span>{vak_naam} {niv_cap}</span> — Domein {dom_id}: {dom_naam}</h1>
    <p class="intro">{intro_text}</p>
  </div>

  <div class="stats">
    <div class="stat"><div class="stat-number">15+</div><div class="stat-label">Oefenvragen</div></div>
    <div class="stat"><div class="stat-number">6</div><div class="stat-label">Echte CE-examens</div></div>
    <div class="stat"><div class="stat-number">100%</div><div class="stat-label">Gratis</div></div>
  </div>

  <div style="text-align:center">
    <a href="{cta_url}" class="cta">Direct oefenen: {dom_naam} →</a>
    <p style="color:var(--text-muted);font-size:.85rem;margin-top:.5rem">Geen account nodig &middot; Werkt ook offline</p>
  </div>

  {ow_html}

  <div class="card">
    <h2>❓ Veelgestelde vragen</h2>
    {faq_html}
  </div>

  <div class="card">
    <h2>⚡ Wat kun je oefenen op Slagio?</h2>
    <ul class="domain-list">
      <li>📝 <strong>Snelle Quiz</strong> — 10 meerkeuze-vragen, 20 seconden per vraag, directe feedback</li>
      <li>📄 <strong>Open CE-vragen</strong> — echte examenopgaven met modelantwoord, zelf nakijken</li>
      <li>🃏 <strong>Flashcards</strong> — spaced repetition met SM-2 algoritme per domein</li>
      <li>📊 <strong>Simulatietoets</strong> — volledig CE-examen met timer en automatische cijferberekening</li>
    </ul>
  </div>

  <div style="text-align:center;margin-top:2rem">
    <a href="{cta_url}" class="cta">Gratis beginnen →</a>
  </div>

  <div class="card" style="margin-top:1.5rem">
    <h2>🔗 Gerelateerde pagina's</h2>
    <p style="color:var(--text-muted);font-size:.9rem;line-height:2">{vak_link_html}</p>
  </div>

  <div class="footer">
    <p>&copy; 2026 Slagio &middot; <a href="https://slagio.nl">slagio.nl</a> &middot; <a href="https://www.examenblad.nl">examenblad.nl</a></p>
    <p style="margin-top:.4rem"><a href="/vakken/">Alle vakpagina's</a> &middot; <a href="{parent_url}">{vak_naam} {niv_cap} volledig overzicht</a></p>
  </div>
</div>
</body>
</html>'''
    return filename, html

# ── sitemap generator ─────────────────────────────────────────────────────
def generate_sitemap_entries(generated_files):
    entries = []
    for fn in generated_files:
        url = f'https://slagio.nl/vakken/{fn}'
        entries.append(
            f'  <url><loc>{url}</loc>'
            f'<lastmod>{SITE_DATE}</lastmod>'
            f'<changefreq>monthly</changefreq>'
            f'<priority>0.75</priority></url>')
    return entries

# ── main ──────────────────────────────────────────────────────────────────
def main():
    print('Parsing data.js...')
    vakken = parse_data_js()
    print(f'  {len(vakken)} vakken gevonden')

    os.makedirs(OUT_DIR, exist_ok=True)

    generated = []
    skipped   = []

    for vak in vakken:
        if not vak['domeinen']:
            skipped.append(f"{vak['naam']} ({vak['niveau']}) — geen domeinen")
            continue
        for dom in vak['domeinen']:
            filename, html = generate_html(vak, dom)
            outpath = os.path.join(OUT_DIR, filename)
            with open(outpath, 'w', encoding='utf-8') as f:
                f.write(html)
            generated.append(filename)
            print(f'  OK {filename}')

    print(f'\nKlaar: {len(generated)} paginas aangemaakt')
    if skipped:
        print(f'Overgeslagen: {len(skipped)}: {", ".join(skipped[:5])}')

    # Schrijf sitemap-fragment
    sitemap_fragment = os.path.join(os.path.dirname(__file__), 'domein-sitemap-fragment.xml')
    entries = generate_sitemap_entries(generated)
    with open(sitemap_fragment, 'w', encoding='utf-8') as f:
        f.write('\n'.join(entries))
    print(f'\nSitemap-fragment: {sitemap_fragment}')
    print(f'  {len(entries)} entries te kopiëren naar sitemap.xml')
    return generated

if __name__ == '__main__':
    main()
