$html = Get-Content 'C:\Users\pepij\examenapp-havo\index.html' -Raw -Encoding UTF8

$vakOrder = @('nl','wa','bi','sk','na','be','en','gs','ak','ec','mw','wb')
$vakPositions = @{}
foreach ($v in $vakOrder) {
    $pos = $html.IndexOf("{id:'$v',naam:")
    if ($pos -ge 0) { $vakPositions[$v] = $pos }
}

$ceRx = [regex]::new("id:'CE',naam:'Centrale Examens'")
foreach ($m in $ceRx.Matches($html)) {
    $p = $m.Index
    $inVak = 'unknown'
    foreach ($v in $vakOrder) {
        $vp = $vakPositions[$v]
        if ($vp -gt 0 -and $p -gt $vp) { $inVak = $v }
        if ($vp -gt $p) { break }
    }
    # Show 80 chars before
    $before = $html.Substring([Math]::Max(0,$p-80), 80).Replace("`n","·")
    Write-Host "CE in vak '$inVak' at $p — before: ...${before}..."
}
Write-Host ""
Write-Host "File size: $([Math]::Round((Get-Item 'C:\Users\pepij\examenapp-havo\index.html').Length/1KB)) KB"
