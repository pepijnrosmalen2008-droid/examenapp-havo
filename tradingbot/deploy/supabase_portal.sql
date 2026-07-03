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

-- Status-snapshot per bot (meerdere bots per gebruiker mogelijk → sleutel user_id + bot_id)
create table if not exists public.bot_state (
  user_id    uuid not null references auth.users(id) on delete cascade,
  bot_id     text not null default 'default',
  state      jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, bot_id)
);
-- Migratie voor wie de oude tabel (alleen user_id als sleutel) al had gedraaid:
alter table public.bot_state add column if not exists bot_id text not null default 'default';
do $$ begin
  alter table public.bot_state drop constraint bot_state_pkey;
  alter table public.bot_state add primary key (user_id, bot_id);
exception when others then null; end $$;
alter table public.bot_state enable row level security;

-- drop-before-create zodat het hele script probleemloos opnieuw te draaien is
drop policy if exists "bot_state select own" on public.bot_state;
drop policy if exists "bot_state insert own" on public.bot_state;
drop policy if exists "bot_state update own" on public.bot_state;
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
  bot_id     text,   -- welke bot; null = broadcast naar alle bots van de gebruiker
  command    text not null check (command in ('emergency_stop')),
  handled    boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.bot_commands add column if not exists bot_id text;  -- migratie oude tabel
alter table public.bot_commands enable row level security;

drop policy if exists "bot_commands select own" on public.bot_commands;
drop policy if exists "bot_commands insert own" on public.bot_commands;
drop policy if exists "bot_commands update own" on public.bot_commands;
create policy "bot_commands select own" on public.bot_commands
  for select using (auth.uid() = user_id);
create policy "bot_commands insert own" on public.bot_commands
  for insert with check (auth.uid() = user_id);
create policy "bot_commands update own" on public.bot_commands
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
