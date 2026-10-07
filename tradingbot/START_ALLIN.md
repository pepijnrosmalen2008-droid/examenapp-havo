# START — de all-in bot (verse start, geen gedoe met oude bots)

Eén bot die alles combineert: prijsstrategie (momentum) + nieuws + politici-transacties +
on-chain (optioneel), met volledige risk-engine, execution-meting en gedachtegang. Eigen verse
database `autopilot_allin.db`, dus volledig los van de oude bots.

## 1. Meteen draaien (geen API-key nodig — PAPER)
```
py bot.py --config config.allin.yaml
```

## 2. Status bekijken (ander venster)
```
py status.py --db autopilot_allin.db
```

## 3. Je Bitvavo-key aansluiten
Zet in `tradingbot/.env`:
```
BITVAVO_API_KEY=...
BITVAVO_API_SECRET=...
```
- **PAPER** (standaard): draait gewoon door, verzint geen echte orders. Key niet eens nodig.
- **SHADOW** (volledig live-pad, echt saldo als limiet, stuurt GEEN orders): zet in
  `config.allin.yaml` → `mode: SHADOW`. Ideaal om met je echte key mee te kijken zonder risico.
- **LIVE** (echt geld): bewust achter een drie-slot-guardrail (zie `.env.example`): `TRADING_MODE=LIVE`
  + bestand `I_UNDERSTAND_THE_RISKS.txt` in de map + `mode: LIVE` in de config. Pas doen als je het
  echt wilt.

## De oude bots?
Niet meer starten. Deze ene bot vervangt ze. De oude `autopilot_<naam>.db`-bestanden mag je laten
staan of weggooien — ze raken de all-in bot niet (die heeft zijn eigen `autopilot_allin.db`).

## On-chain aanzetten (optioneel, later)
`config.allin.yaml` → `research.onchain_sources` vullen met je eigen whale/flow-JSON-bron; eventueel
`ONCHAIN_API_KEY` in `.env`. Leeg laten = die bron doet gewoon niets.
