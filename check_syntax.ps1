$html = Get-Content 'C:\Users\pepij\examenapp-havo\index.html' -Raw -Encoding UTF8

$biCE = $html.IndexOf("id:'CE',naam:'Centrale Examens'")
$skPos = $html.IndexOf("{id:'sk',")
$ceBlock = $html.Substring($biCE, $skPos - $biCE)

# Check for real (unescaped) newlines inside single-quoted JS strings
$rx = [regex]::new("v:'[^'`n]*`n", [System.Text.RegularExpressions.RegexOptions]::Singleline)
$hits = $rx.Matches($ceBlock)
Write-Host "Unescaped newlines in question strings (bi CE): $($hits.Count)"

# Check for backticks
$bt = ($ceBlock.ToCharArray() | Where-Object { $_ -eq [char]96 }).Count
Write-Host "Backticks in bi CE block: $bt"

# Show first few questions
$firstQ = $ceBlock.Substring(0, 600)
Write-Host "--- First 600 chars of bi CE ---"
Write-Host $firstQ

# Check ce_data.js for encoding issues
$ceJs = Get-Content 'C:\Users\pepij\examenapp-havo\ce_data.js' -Raw -Encoding UTF8
$ceJs = $ceJs.TrimStart([char]0xFEFF)
# Find questions with problematic chars
$probPattern = [regex]::new("v:'[^']*[`n`r\x00-\x08\x0B\x0C\x0E-\x1F][^']*'")
$probs = $probPattern.Matches($ceJs)
Write-Host "Questions with control chars in ce_data.js: $($probs.Count)"
if ($probs.Count -gt 0) {
    Write-Host "First problematic: $($probs[0].Value.Substring(0, [Math]::Min(200, $probs[0].Length)))"
}
