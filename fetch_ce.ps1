$sq = [char]39
$total = 1206
$pageSize = 100
$allRows = @()

Write-Host "Fetching rows from HuggingFace..."
for ($offset = 0; $offset -lt $total; $offset += $pageSize) {
    $url = "https://datasets-server.huggingface.co/rows?dataset=jjzha/dutch-central-exam-mcq&config=default&split=train&offset=$offset&length=$pageSize"
    $resp = Invoke-RestMethod -Uri $url -Method Get
    $allRows += $resp.rows | ForEach-Object { $_.row }
    Write-Host "  Fetched $($allRows.Count) rows..."
    Start-Sleep -Milliseconds 300
}
Write-Host "Total: $($allRows.Count)"

$vakMap = @{
    "Biologie" = "bi"; "Scheikunde" = "sk"; "Natuurkunde" = "na"
    "Economie" = "ec"; "Aardrijkskunde" = "ak"; "Geschiedenis" = "gs"
    "Maatschappijwetenschappen" = "mw"; "Maatschappijleer" = "mw"; "Maatschappijleer 2" = "mw"
    "Bedrijfseconomie" = "be"; "Wiskunde A" = "wa"
}

function Parse-FN($fn) {
    $fn = $fn -replace "\.pdf$", ""
    $parts = $fn -split "_"
    $level = $parts[0]
    $tv = if ($fn -match "_II$") { 2 } else { 1 }
    $jaar = 0
    foreach ($p in $parts) { if ($p -match "^\d{4}$") { $jaar = [int]$p } }
    return @{ level = $level; jaar = $jaar; tv = $tv }
}

function EJ($s) {
    return $s -replace "\\", "\\\\" -replace [char]39, "\'" -replace "`n", " " -replace "`r", ""
}

$byVak = @{}
foreach ($row in $allRows) {
    $info = Parse-FN $row.file_name
    # Include HAVO and VWO
    if ($info.level -ne "HAVO" -and $info.level -ne "VWO") { continue }
    $cat = $row.category_original_lang
    if (-not $vakMap.ContainsKey($cat)) { continue }
    $vakId = $vakMap[$cat]
    $ansIdx = [int]$row.answer - 1
    if ($ansIdx -lt 0 -or $ansIdx -ge $row.options.Count) { continue }
    $u = ($row.options[$ansIdx]).Trim()
    $v = ($row.question).Trim()
    if (-not $byVak.ContainsKey($vakId)) { $byVak[$vakId] = [System.Collections.Generic.List[object]]::new() }
    $niveau = if ($info.level -eq "VWO") { " (VWO)" } else { "" }
    $byVak[$vakId].Add(@{ v = $v; u = $u; jaar = $info.jaar; tv = $info.tv; niveau = $niveau })
}

Write-Host "=== COUNTS ==="
$totaal = 0
foreach ($k in ($byVak.Keys | Sort-Object)) {
    Write-Host "  $k : $($byVak[$k].Count)"
    $totaal += $byVak[$k].Count
}
Write-Host "  TOTAAL: $totaal"

Write-Host "Building JS..."
$sb = [System.Text.StringBuilder]::new()
[void]$sb.AppendLine("const CE_OE = {")
foreach ($vakId in ($byVak.Keys | Sort-Object)) {
    [void]$sb.AppendLine("  ${sq}${vakId}${sq}: [")
    foreach ($q in $byVak[$vakId]) {
        $v = EJ $q.v
        $u = EJ $q.u
        $bron = "CE $($q.jaar) T$($q.tv)$($q.niveau)"
        [void]$sb.AppendLine("    {v:${sq}${v}${sq},u:${sq}${u}${sq},jaar:$($q.jaar),tijdvak:$($q.tv),bron:${sq}${bron}${sq}},")
    }
    [void]$sb.AppendLine("  ],")
}
[void]$sb.AppendLine("};")

$sb.ToString() | Out-File -FilePath "C:\Users\pepij\examenapp-havo\ce_data.js" -Encoding UTF8
Write-Host "Written ce_data.js - done!"
