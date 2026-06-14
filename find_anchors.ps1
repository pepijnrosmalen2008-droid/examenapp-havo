# Find unique anchor text at end of each vak's last domein
$html = Get-Content 'C:\Users\pepij\examenapp-havo\index.html' -Raw -Encoding UTF8

$vakTargets = @{
    'bi' = 'sk'
    'na' = 'be'
    'be' = 'en'
    'mw' = $null  # last vak
}

$vakOrder = @('nl','wa','bi','sk','na','be','en','gs','ak','ec','mw')

foreach ($vakId in @('bi','na','be','mw')) {
    $myIdx = [array]::IndexOf($vakOrder, $vakId)
    $vakStart = $html.IndexOf("{id:'$vakId',naam:")

    if ($vakId -eq 'mw') {
        # last vak: find VAKKEN end
        $vakEnd = $html.IndexOf("];", $html.IndexOf("const VAKKEN = [") + 10)
    } else {
        $nextId = $vakOrder[$myIdx + 1]
        $vakEnd = $html.IndexOf("{id:'$nextId',naam:", $vakStart)
    }

    # Get the vak block
    $block = $html.Substring($vakStart, $vakEnd - $vakStart)

    # Find the last ]} in the block (closes last domein) - should be second-to-last ]}
    $rxInner = [regex]::new("\]}", [System.Text.RegularExpressions.RegexOptions]::Singleline)
    $allM = $rxInner.Matches($block)
    Write-Host "=== $vakId : $($allM.Count) ]} found ==="

    # Show last 100 chars before second-to-last ]}
    if ($allM.Count -ge 2) {
        $anchor = $allM[$allM.Count - 2]
        $contextStart = [Math]::Max(0, $anchor.Index - 80)
        $context = $block.Substring($contextStart, $anchor.Index - $contextStart + 2)
        Write-Host "Anchor context (ends with ]}):"
        Write-Host $context.Replace("`n","·").Replace("`r","")
        Write-Host "Full anchor block position in HTML: $($vakStart + $anchor.Index)"
        Write-Host ""
    }
}
