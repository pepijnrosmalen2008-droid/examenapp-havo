#!/usr/bin/env bash
# sync-examens.sh — download PDFs from AlleExamens.nl, upload to Supabase Storage
set -euo pipefail

SUPABASE_URL="https://sxrjdssmgwwygtskovyc.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4cmpkc3NtZ3d3eWd0c2tvdnljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2OTEwNDAsImV4cCI6MjA4OTI2NzA0MH0.iML8S6I6wZ9zGUDBZJleyFHlpPYmUvdGyNyDSYcxon4"
BUCKET="examens"
TMPFILE=$(mktemp /tmp/examen_XXXXXX.pdf)
trap 'rm -f "$TMPFILE"' EXIT

# Counters
ok=0; notfound=0; errors=0; skipped=0

declare -A HAVO_VAKKEN=(
  [nl]="Nederlands" [wa]="Wiskunde A" [wb]="Wiskunde B"
  [bi]="Biologie"   [sk]="Scheikunde" [na]="Natuurkunde"
  [en]="Engels"     [ec]="Economie"   [be]="Bedrijfseconomie"
  [gs]="Geschiedenis" [ak]="Aardrijkskunde" [mw]="Maatschappijwetenschappen"
)
declare -A VWO_VAKKEN=(
  [nl]="Nederlands" [wa]="Wiskunde A" [wb]="Wiskunde B"
  [bi]="Biologie"   [sk]="Scheikunde" [na]="Natuurkunde"
  [en]="Engels"     [ec]="Economie"   [be]="Bedrijfseconomie"
  [gs]="Geschiedenis" [ak]="Aardrijkskunde" [mw]="Maatschappijwetenschappen"
  [du]="Duits" [fr]="Frans" [la]="Latijn" [gr]="Grieks" [in]="Informatica"
)

JAREN=(2019 2021 2022 2023 2024 2025)
TVS=(I II)
TYPES=(opgaven correctievoorschrift)

process_combo() {
  local niveau="$1" id="$2" naam="$3" jaar="$4" tv="$5" type="$6"

  # URL-encode naam (spaces → %20)
  local enc="${naam// /%20}"
  local niv_upper="${niveau^^}"
  local src_url="https://static.alleexamens.nl/${niv_upper}/${enc}/${jaar}/${tv}/${enc}/${enc}%20${jaar}%20${tv}_${type}.pdf"
  local storage_path="${niveau}/${id}/${jaar}/${tv}/${type}.pdf"
  local upload_url="${SUPABASE_URL}/storage/v1/object/${BUCKET}/${storage_path}"

  # Download to temp file
  local http_code
  http_code=$(curl -s -L -o "$TMPFILE" -w "%{http_code}" \
    -H "User-Agent: Mozilla/5.0 (compatible; SlagioBot/1.0)" \
    --max-time 30 \
    "$src_url" 2>/dev/null || echo "000")

  if [[ "$http_code" == "404" ]]; then
    notfound=$((notfound+1))
    return
  fi

  if [[ "$http_code" != "200" ]]; then
    echo "  SKIP (HTTP $http_code): $storage_path"
    errors=$((errors+1))
    return
  fi

  # Check it's actually a PDF (starts with %PDF)
  local magic
  magic=$(head -c 4 "$TMPFILE" 2>/dev/null || echo "")
  if [[ "$magic" != "%PDF" ]]; then
    notfound=$((notfound+1))
    return
  fi

  local filesize
  filesize=$(wc -c < "$TMPFILE")

  # Upload to Supabase
  local up_code
  up_code=$(curl -s -o /dev/null -w "%{http_code}" \
    -X POST "$upload_url" \
    -H "Authorization: Bearer ${ANON_KEY}" \
    -H "Content-Type: application/pdf" \
    -H "x-upsert: true" \
    --data-binary "@$TMPFILE" \
    --max-time 60 2>/dev/null || echo "000")

  if [[ "$up_code" == "200" || "$up_code" == "201" ]]; then
    ok=$((ok+1))
    local kb=$(( filesize / 1024 ))
    printf "\r  ✅ ok:%-4d  notfound:%-4d  err:%-3d  [%s]           " \
      "$ok" "$notfound" "$errors" "$storage_path"
  else
    echo ""
    echo "  ❌ upload failed (HTTP $up_code): $storage_path"
    errors=$((errors+1))
  fi
}

echo ""
echo "☁️  Slagio — examen PDF sync naar Supabase"
echo "   Bucket: ${SUPABASE_URL}/storage/v1/object/public/${BUCKET}"
echo ""

for niveau in havo vwo; do
  if [[ "$niveau" == "havo" ]]; then
    declare -n VAKKEN=HAVO_VAKKEN
  else
    declare -n VAKKEN=VWO_VAKKEN
  fi

  for id in "${!VAKKEN[@]}"; do
    naam="${VAKKEN[$id]}"
    for jaar in "${JAREN[@]}"; do
      for tv in "${TVS[@]}"; do
        for type in "${TYPES[@]}"; do
          process_combo "$niveau" "$id" "$naam" "$jaar" "$tv" "$type"
        done
      done
    done
  done
done

echo ""
echo ""
echo "✅  Klaar!"
echo "   Geüpload:      $ok"
echo "   Niet gevonden: $notfound"
echo "   Fouten:        $errors"
echo ""
echo "📋  Publieke URL-basis:"
echo "   ${SUPABASE_URL}/storage/v1/object/public/${BUCKET}"
echo "   Voorbeeld: ${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/havo/bi/2023/I/opgaven.pdf"
