$html = Get-Content 'C:\Users\pepij\examenapp-havo\index.html' -Raw -Encoding UTF8

# Find all CE domein positions and what vak/context they're in
$ceRx = [regex]::new("id:'CE',naam:'Centrale Examens'")
foreach ($m in $ceRx.Matches($html)) {
    $p = $m.Index
    $before = $html.Substring([Math]::Max(0, $p - 200), 200)
    $after  = $html.Substring($p, 150)
    Write-Host "=== CE at $p ==="
    Write-Host "BEFORE: $($before.Replace("`n",'|').Replace("`r",''))"
    Write-Host "AFTER: $($after.Substring(0,100))"
    Write-Host ""
}

# Also check: is there any CE domein OUTSIDE VAKKEN?
$vakkenStart = $html.IndexOf("const VAKKEN = [")
$vakkenEnd   = $html.IndexOf("];", $vakkenStart + 10)
Write-Host "HAVO VAKKEN: $vakkenStart - $vakkenEnd"

# Find end of HAVO VAKKEN (after all insertions)
# The actual end should be just after all CE domeinen
$allCE = @()
foreach ($m in $ceRx.Matches($html)) { $allCE += $m.Index }
Write-Host "CE positions: $($allCE -join ', ')"
Write-Host "Last CE vs VAKKEN end: last=$($allCE[-1]) vakkenEnd=$vakkenEnd"

# Check what comes after the last CE domein for bi
$biCEPos = $allCE[0]
$naxtAfterBiCE = $html.IndexOf("];", $biCEPos)
Write-Host "First ]]; after bi CE at: $naxtAfterBiCE"
Write-Host "Content: $($html.Substring($naxtAfterBiCE - 50, 100).Replace("`n",'|'))"
