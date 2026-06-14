$total = 1206
$pageSize = 100
$allRows = @()
for ($offset = 0; $offset -lt $total; $offset += $pageSize) {
    $url = "https://datasets-server.huggingface.co/rows?dataset=jjzha/dutch-central-exam-mcq&config=default&split=train&offset=$offset&length=$pageSize"
    $resp = Invoke-RestMethod -Uri $url -Method Get
    $allRows += $resp.rows | ForEach-Object { $_.row }
    Start-Sleep -Milliseconds 200
}
Write-Host "Total rows: $($allRows.Count)"

$levels = @{}
$cats = @{}
foreach ($r in $allRows) {
    $fn = $r.file_name -replace "\.pdf$", ""
    $lvl = ($fn -split "_")[0]
    $cat = $r.category_original_lang
    if (-not $levels.ContainsKey($lvl)) { $levels[$lvl] = 0 }
    $levels[$lvl]++
    $catkey = "$lvl|$cat"
    if (-not $cats.ContainsKey($catkey)) { $cats[$catkey] = 0 }
    $cats[$catkey]++
}

Write-Host "=== BY LEVEL ==="
$levels.GetEnumerator() | Sort-Object Value -Descending | ForEach-Object { Write-Host "  $($_.Key): $($_.Value)" }
Write-Host "=== HAVO CATEGORIES ==="
$cats.GetEnumerator() | Where-Object { $_.Key -like "HAVO*" } | Sort-Object Value -Descending | ForEach-Object { Write-Host "  $($_.Key): $($_.Value)" }
Write-Host "=== VWO CATEGORIES ==="
$cats.GetEnumerator() | Where-Object { $_.Key -like "VWO*" } | Sort-Object Value -Descending | ForEach-Object { Write-Host "  $($_.Key): $($_.Value)" }
