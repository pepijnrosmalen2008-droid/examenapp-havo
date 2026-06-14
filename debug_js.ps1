# Find JS string-breaking characters in CE domein blocks
$html = Get-Content 'C:\Users\pepij\examenapp-havo\index.html' -Raw -Encoding UTF8

$ceRx = [regex]::new("id:'CE',naam:'Centrale Examens'([\s\S]*?)\]}", [System.Text.RegularExpressions.RegexOptions]::Singleline)
$ceMatches = $ceRx.Matches($html)
Write-Host "CE blocks found: $($ceMatches.Count)"

foreach ($cm in $ceMatches) {
    $block = $cm.Value
    # Find unescaped single quotes inside v:'...' or u:'...' values
    # Pattern: after v:' or u:', find a ' that is NOT preceded by \
    $strRx = [regex]::new("(?:v|u|bron):'((?:[^'\\]|\\.)*)'", [System.Text.RegularExpressions.RegexOptions]::Singleline)
    $badCount = 0
    foreach ($sm in $strRx.Matches($block)) {
        $val = $sm.Groups[1].Value
        # Check for real newlines
        if ($val -match "[\r\n]") {
            Write-Host "REAL NEWLINE in: $($val.Substring(0,[Math]::Min(80,$val.Length)))"
            $badCount++
        }
    }
    # Also check for unmatched quotes by counting
    # Find all v:'...' patterns and check they close properly
    $vRx = [regex]::new("v:'([^'\\]|\\.)*'", [System.Text.RegularExpressions.RegexOptions]::Singleline)
    # Look for any line with odd number of unescaped quotes
    $lines = $block -split "`n"
    $lineNum = 0
    foreach ($line in $lines) {
        $lineNum++
        # Count unescaped single quotes
        $count = ([regex]::Matches($line, "(?<!\\)'")).Count
        # Should be even (open/close pairs)
        if ($count % 2 -ne 0) {
            Write-Host "ODD QUOTES on line $lineNum : $($line.Substring(0,[Math]::Min(120,$line.Length)))"
            $badCount++
            if ($badCount -ge 5) { break }
        }
    }
    Write-Host "Block check done - issues: $badCount"
}
