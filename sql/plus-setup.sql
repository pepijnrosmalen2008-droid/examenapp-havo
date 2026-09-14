-- ═══════════════════════════════════════════════════════════════════════
-- plus-setup.sql — Slagio Plus + AI-nakijken. DE SERVER is de bron van waarheid.
-- ───────────────────────────────────────────────────────────────────────
-- Draai dit ÉÉN keer, in z'n geheel, in de Supabase SQL-editor
-- (Dashboard → SQL Editor → New query → plak alles → Run).
-- Idempotent: opnieuw draaien is veilig en wist GEEN data.
--
-- Kernidee (jouw eigen eis): de frontend mag Plus-status alleen LEZEN voor de
-- UI. Hij mag nooit kunnen zeggen "ik ben Plus". Daarom heeft plus_status wél
-- een lees-policy, maar bewust GEEN schrijf-policy: alleen de betaal-webhook
-- (service_role) mag plus_until zetten. Zo kan niemand met DevTools zichzelf
-- Plus geven.
-- ═══════════════════════════════════════════════════════════════════════

-- ─── 1) PLUS-STATUS: wie is Plus, en tot wanneer ─────────────────────────
create table if not exists public.plus_status(
  user_id    uuid primary key references auth.users(id) on delete cascade,
  plus_until timestamptz,
  plan       text,
  updated_at timestamptz not null default now()
);
alter table public.plus_status enable row level security;

-- Lezen: alleen je eigen rij.
drop policy if exists "lees eigen plus" on public.plus_status;
create policy "lees eigen plus" on public.plus_status
  for select using (auth.uid() = user_id);
-- Schrijven: GEEN policy → via de app kan niemand hierin schrijven.
-- Alleen de webhook (service_role) en SECURITY DEFINER-functies mogen erbij.


-- ─── 2) AI-VERBRUIK: quotum server-side tellen ───────────────────────────
create table if not exists public.ai_usage(
  user_id    uuid not null references auth.users(id) on delete cascade,
  periode    text not null,          -- bv. '2026-W38' (ISO-week)
  aantal     int  not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, periode)
);
alter table public.ai_usage enable row level security;

-- Lezen: alleen je eigen tellers (voor "je hebt nog 2 beurten over").
drop policy if exists "lees eigen usage" on public.ai_usage;
create policy "lees eigen usage" on public.ai_usage
  for select using (auth.uid() = user_id);
-- Schrijven: alleen de edge function (service_role) telt het verbruik op.


-- ─── 3) HULP-RPC: "ben ik Plus?" (leest de server-waarheid) ──────────────
-- De app roept dit aan; geeft alleen true/false + einddatum terug. Geeft
-- altijd één rij terug, ook als je nog nooit Plus was.
create or replace function public.plus_check()
returns table(actief boolean, plus_until timestamptz, plan text)
language sql stable security definer set search_path = public as $$
  select coalesce(ps.plus_until > now(), false) as actief,
         ps.plus_until, ps.plan
    from (select auth.uid() as uid) u
    left join public.plus_status ps on ps.user_id = u.uid;
$$;
grant execute on function public.plus_check() to authenticated;


-- ═══════════════════════════════════════════════════════════════════════
-- KLAAR. Test (als ingelogde gebruiker):  select * from public.plus_check();
--
-- ── Jezelf Plus geven om te testen (voordat Mollie er is) ────────────────
-- 1) zoek je eigen user-id:
--      select id, email from auth.users where email = 'slagiocompany@gmail.com';
-- 2) plak het id hieronder en geef jezelf 1 jaar Plus:
--      insert into public.plus_status(user_id, plus_until, plan)
--      values ('PLAK-HIER-JE-USER-ID', now() + interval '1 year', 'test')
--      on conflict (user_id) do update
--        set plus_until = excluded.plus_until, plan = excluded.plan;
-- ═══════════════════════════════════════════════════════════════════════
