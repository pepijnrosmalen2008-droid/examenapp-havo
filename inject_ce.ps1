# Inject CE vragen as new 'CE' domein into each vak in index.html
# Strategy: find each vak's start, find next vak's start (or VAKKEN end),
# then find the LAST ]} within that range (closes last domein), insert after it.

$sq = [char]39

# --- 1. Parse ce_data.js ---
$ceJs = Get-Content "C:\Users\pepij\examenapp-havo\ce_data.js" -Raw -Encoding UTF8
$ceJs = $ceJs.TrimStart([char]0xFEFF)

$itemPattern = [regex]::new("\{v:${sq}([\s\S]*?)${sq},u:${sq}([\s\S]*?)${sq},jaar:(\d+),tijdvak:(\d),bron:${sq}([^${sq}]*)${sq}\}", [System.Text.RegularExpressions.RegexOptions]::Singleline)
$vakBlockPattern = [regex]::new("${sq}([a-z]+)${sq}\s*:\s*\[([\s\S]*?)\s*\],?\s*\r?\n\s*(?=${sq}[a-z]|\})", [System.Text.RegularExpressions.RegexOptions]::Singleline)

$byVak = @{}
foreach ($vm in $vakBlockPattern.Matches($ceJs)) {
    $vakId = $vm.Groups[1].Value
    $body  = $vm.Groups[2].Value
    $items = [System.Collections.Generic.List[hashtable]]::new()
    foreach ($m in $itemPattern.Matches($body)) {
        $items.Add(@{ v=$m.Groups[1].Value; u=$m.Groups[2].Value; jaar=$m.Groups[3].Value; tv=$m.Groups[4].Value; bron=$m.Groups[5].Value })
    }
    if ($items.Count -gt 0) {
        $byVak[$vakId] = $items
        Write-Host "Parsed $vakId : $($items.Count) items"
    }
}

if ($byVak.Count -eq 0) { Write-Host "ERROR: no data"; exit 1 }

# --- 2. Build CE domein string ---
function Build-CE($items) {
    $desc = "Echte CE-vragen van examenblad.nl (HAVO + VWO, 1999-2024). CC-BY 4.0. Schrijf het antwoord in eigen woorden en vergelijk met het modelantwoord."
    $sb = [System.Text.StringBuilder]::new()
    [void]$sb.Append(",`n  {id:${sq}CE${sq},naam:${sq}Centrale Examens${sq},beschrijving:${sq}${desc}${sq},oe:[`n")
    foreach ($q in $items) {
        # Already escaped by fetch_ce.ps1 - use directly without re-escaping
        [void]$sb.Append("   {v:${sq}$($q.v)${sq},u:${sq}$($q.u)${sq},jaar:$($q.jaar),tijdvak:$($q.tv),bron:${sq}$($q.bron)${sq}},`n")
    }
    [void]$sb.Append("  ]}")
    return $sb.ToString()
}

# --- 3. Load index.html as string ---
$htmlPath = "C:\Users\pepij\examenapp-havo\index.html"
$html = Get-Content $htmlPath -Raw -Encoding UTF8

# Find HAVO VAKKEN array bounds
$vakkenStart = $html.IndexOf("const VAKKEN = [")
$vakkenEnd   = $html.Length  # use full length; per-vak bounding via nextId is sufficient
Write-Host "VAKKEN array: starts at $vakkenStart (end not used - using full length)"

# Process each vak (only within HAVO VAKKEN range)
$insertions = 0
$offset = 0  # grows as we insert text

foreach ($vakId in ($byVak.Keys | Sort-Object)) {
    $items = $byVak[$vakId]

    # Find this vak's start within VAKKEN (adjusted for already-inserted text)
    $searchStart = $vakkenStart + $offset
    $searchEnd   = $vakkenEnd   + $offset

    $vakMarker  = "{id:${sq}${vakId}${sq},"
    $vakPos = $html.IndexOf($vakMarker, $searchStart)
    if ($vakPos -lt 0 -or $vakPos -gt $searchEnd) {
        Write-Host "  SKIP $vakId - not found in HAVO VAKKEN range"
        continue
    }

    # Find next vak's start (or end of VAKKEN array)
    # Walk through characters to find next top-level {id: after vakPos
    # Simpler: find next occurrence of "{id:'" that is NOT inside a string
    # Best approach: find the ]} + ]}, pattern after vakPos but before next {id:'
    # We look for the pattern: \n ]},\n (end of domeinen + end of vak) within this vak's range

    # Find the next vak marker after this one (to bound our search)
    $nextVakPos = $searchEnd + 1  # default: end of VAKKEN
    $allVakIds = @('nl','wa','bi','sk','na','be','en','gs','ak','ec','mw','wb')
    $myIdx = [array]::IndexOf($allVakIds, $vakId)
    if ($myIdx -ge 0 -and $myIdx -lt $allVakIds.Length - 1) {
        $nextId = $allVakIds[$myIdx + 1]
        $np = $html.IndexOf("{id:${sq}${nextId}${sq},", $vakPos + 1)
        if ($np -gt 0) { $nextVakPos = $np }
    }

    # Within [vakPos, nextVakPos], find the last occurrence of ']}'
    # This closes the last domein's oe array + the domein object
    # The insertion point is right after this '}]}'
    $lastBracePos = -1
    $searchChunk = $html.Substring($vakPos, $nextVakPos - $vakPos)
    # Find all ']}' and take the last one
    $rx = [regex]::new("\]}", [System.Text.RegularExpressions.RegexOptions]::Singleline)
    $allMatches = $rx.Matches($searchChunk)
    if ($allMatches.Count -eq 0) {
        Write-Host "  SKIP $vakId - no ']}' found in range"
        continue
    }
    # Second-to-last ]}:  last one closes domeinen+vak, second-to-last closes the final domein
    if ($allMatches.Count -lt 2) { Write-Host "  SKIP $vakId - not enough ]} matches"; continue }
    $lastMatch = $allMatches[$allMatches.Count - 2]
    $insertPos = $vakPos + $lastMatch.Index + $lastMatch.Length

    # Build snippet
    $snippet = Build-CE $items

    # Insert
    $html = $html.Substring(0, $insertPos) + $snippet + $html.Substring($insertPos)
    $offset += $snippet.Length
    $insertions++
    Write-Host "  Inserted CE domein for $vakId ($($items.Count) vragen) at pos $insertPos"
}

if ($insertions -gt 0) {
    $html | Out-File -FilePath $htmlPath -Encoding UTF8 -NoNewline
    Write-Host "Done: $insertions vak(ken) updated"
} else {
    Write-Host "ERROR: nothing inserted"
    exit 1
}
