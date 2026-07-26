-- ══════════════════════════════════════════════════════════════════════════
-- Webportaal RESET voor slagio.nl/bot.html
-- Gooit de oude tabellen + policies VOLLEDIG weg en maakt ze schoon opnieuw aan.
-- Zo kan er niets "already exists"-en → dit draait altijd foutloos, zo vaak je wilt.
--
-- Uitvoeren: Supabase dashboard → SQL Editor → New query → plak dit hele blok → Run.
--
-- VEILIG: dit wist alleen de status-snapshots en de commando-wachtrij. De bots
-- vullen bot_state bij hun eerstvolgende sync vanzelf weer. Er gaat GEEN handels-
-- data verloren (die staat lokaal in autopilot_<bot>.db, niet in Supabase).
--
-- LET OP: dit lost een LOGIN-fout (400 op /auth/v1/token) NIET op. Dat is een
-- Auth-kwestie, geen tabel-kwestie — zie de checklist onderaan dit bestand.
-- ══════════════════════════════════════════════════════════════════════════

-- 1· oude tabellen volledig weg (hun policies verdwijnen mee door CASCADE)
drop table if exists public.bot_commands cascade;
drop table if exists public.bot_state    cascade;

-- 2· status-snapshot per bot (sleutel user_id + bot_id → meerdere bots per gebruiker)
create table public.bot_state (
  user_id    uuid not null references auth.users(id) on delete cascade,
  bot_id     text not null default 'default',
  state      jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, bot_id)
);
alter table public.bot_state enable row level security;
create policy "bot_state select own" on public.bot_state
  for select using (auth.uid() = user_id);
create policy "bot_state insert own" on public.bot_state
  for insert with check (auth.uid() = user_id);
create policy "bot_state update own" on public.bot_state
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 3· commando-wachtrij portaal → bot. Bewust maar één toegestaan commando: de noodstop.
create table public.bot_commands (
  id         bigint generated always as identity primary key,
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  bot_id     text,   -- welke bot; null = broadcast naar alle bots van de gebruiker
  command    text not null check (command in ('emergency_stop')),
  handled    boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.bot_commands enable row level security;
create policy "bot_commands select own" on public.bot_commands
  for select using (auth.uid() = user_id);
create policy "bot_commands insert own" on public.bot_commands
  for insert with check (auth.uid() = user_id);
create policy "bot_commands update own" on public.bot_commands
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── klaar. Controle: onderstaande query hoort 2 tabellen te tonen. ──
-- select table_name from information_schema.tables
--   where table_schema = 'public' and table_name in ('bot_state','bot_commands');

-- ══════════════════════════════════════════════════════════════════════════
-- ALS DE LOGIN NOG STEEDS 400 GEEFT (dat fixt dit script NIET):
--   1. Staat je Supabase-project op "Paused"? (gratis-tier pauzeert na inactiviteit)
--      → dashboard → Restore/Resume.
--   2. Bestaat de bot-gebruiker? dashboard → Authentication → Users → "Add user",
--      vink "Auto Confirm User" aan. E-mail = BOT_PORTAL_EMAIL uit je .env.
--   3. Wachtwoord gelijk aan BOT_PORTAL_PASSWORD in je .env? Zo niet: reset het
--      wachtwoord van die user en zet exact hetzelfde in .env.
--   4. Test daarna handmatig inloggen op slagio.nl/bot.html met diezelfde gegevens.
-- ══════════════════════════════════════════════════════════════════════════
