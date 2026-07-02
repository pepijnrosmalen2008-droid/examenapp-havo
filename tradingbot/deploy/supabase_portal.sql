-- Webportaal-setup voor slagio.nl/bot.html
-- Uitvoeren in de Supabase SQL Editor (dashboard → SQL Editor → New query → Run).
--
-- Beveiligingsmodel:
--   * De anon key is publiek (staat in de site) — de beveiliging komt van
--     Supabase Auth (email+wachtwoord) + Row Level Security hieronder:
--     iedere rij is alleen leesbaar/schrijfbaar voor de ingelogde eigenaar.
--   * Maak daarna ÉÉN gebruiker aan: dashboard → Authentication → Users →
--     "Add user" (vink "Auto confirm user" aan). Gebruik een sterk, uniek wachtwoord.
--   * Zet publieke registratie UIT: Authentication → Sign In / Up →
--     "Allow new users to sign up" uitschakelen. Anders kan iedereen een account
--     maken (die ziet dankzij RLS niets van jou, maar dicht is dicht).

-- Status-snapshot van de bot (één rij per gebruiker, geüpsert elke cycle)
create table if not exists public.bot_state (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  state      jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.bot_state enable row level security;

create policy "bot_state select own" on public.bot_state
  for select using (auth.uid() = user_id);
create policy "bot_state insert own" on public.bot_state
  for insert with check (auth.uid() = user_id);
create policy "bot_state update own" on public.bot_state
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Commando-wachtrij van portaal → bot. Bewust maar één toegestaan commando:
-- de noodstop. Herstarten/halt opheffen kan uitsluitend op de machine zelf.
create table if not exists public.bot_commands (
  id         bigint generated always as identity primary key,
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
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
