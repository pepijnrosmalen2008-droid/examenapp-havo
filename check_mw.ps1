$html = Get-Content 'C:\Users\pepij\examenapp-havo\index.html' -Raw -Encoding UTF8

$mwCE = 809994

# Show 2000 chars before to find which vak/domein this is in
$before2k = $html.Substring([Math]::Max(0, $mwCE - 2000), 2000)

# Find the last {id:'xx',naam: in the before block - that tells us which vak
$rx = [regex]::new("\{id:'([a-z]+)',naam:'([^']+)'")
$hits = $rx.Matches($before2k)
if ($hits.Count -gt 0) {
    $last = $hits[$hits.Count - 1]
    Write-Host "Last vak/domein before mw CE: id='$($last.Groups[1].Value)' naam='$($last.Groups[2].Value)'"
}

# Show the 500 chars right before mw CE
Write-Host "--- 500 chars before ---"
Write-Host $html.Substring($mwCE - 500, 500)

# Also check structure after all CE
Write-Host "--- After last CE (300 chars) ---"
$lastCE = 809994
$endOfCE = $html.IndexOf('  ]}', $lastCE + 50)
Write-Host $html.Substring($endOfCE - 10, 300)
