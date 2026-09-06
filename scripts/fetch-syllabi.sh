#!/bin/bash
set -uo pipefail
BASE="https://www.examenblad.nl"; OUT="syllabi/2027"; mkdir -p "$OUT"; T=$(mktemp -d)
MAP="havo nl talen/nederlands-havo|havo en talen/engels-havo|havo wa exacte-vakken/wiskunde-a-havo-0|havo wb exacte-vakken/wiskunde-b-havo|havo be maatschappijvakken/bedrijfseconomie-havo|havo ec maatschappijvakken/economie-havo|havo bi exacte-vakken/biologie-havo|havo gs maatschappijvakken/geschiedenis-havo|havo sk exacte-vakken/scheikunde-havo|havo na exacte-vakken/natuurkunde-havo|havo ak maatschappijvakken/aardrijkskunde-havo|havo mw maatschappijvakken/maatschappij-wetenschappen-havo|vwo nl talen/nederlands-vwo|vwo en talen/engels-vwo|vwo wa exacte-vakken/wiskunde-a-vwo|vwo wb exacte-vakken/wiskunde-b-vwo|vwo be maatschappijvakken/bedrijfseconomie-vwo|vwo ec maatschappijvakken/economie-vwo|vwo bi exacte-vakken/biologie-vwo|vwo gs maatschappijvakken/geschiedenis-vwo|vwo sk exacte-vakken/scheikunde-vwo|vwo na exacte-vakken/natuurkunde-vwo|vwo ak maatschappijvakken/aardrijkskunde-vwo|vwo mw maatschappijvakken/maatschappij-wetenschappen-vwo|vwo du talen/duits-vwo|vwo fr talen/frans-vwo|vwo in exacte-vakken/informatica-vwo|vwo la talen/latijnse-taal-cultuur-vwo|vwo gr talen/griekse-taal-cultuur-vwo"
IFS='|' read -ra ROWS <<< "$MAP"
for row in "${ROWS[@]}"; do
  set -- $row; niv=$1; vak=$2; path=$3
  curl -sSL --compressed --max-time 60 "$BASE/2027/$niv/vakken/$path" 2>/dev/null | tr -d '\0' > "$T/l.html"
  dp=$(grep -oiE 'href="/2027/'"$niv"'/documenten/[^"]*"' "$T/l.html" | sed -E 's/href="//;s/"$//' | grep -i syllabus | head -1)
  if [ -z "$dp" ]; then echo "MISS  $niv $vak (geen syllabus-doc-link)"; continue; fi
  dest="$OUT/$niv-$vak.pdf"
  curl -sSL --compressed --max-time 120 -o "$dest" "$BASE$dp" 2>/dev/null
  if head -c4 "$dest" 2>/dev/null | grep -q '%PDF'; then
    echo "OK    $niv $vak  $(( $(stat -c%s "$dest")/1024 ))KB  <- $dp"
  else
    ct=$(head -c 200 "$dest" | tr -d '\0' | head -c60)
    echo "NOPDF $niv $vak  <- $dp  [${ct}]"; rm -f "$dest"
  fi
done
rm -rf "$T"
