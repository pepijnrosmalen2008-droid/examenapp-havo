-- ═══════════════════════════════════════════════════════════════════════
-- league-setup.sql - ECHTE MEDESPELERS in de weekwedstrijd (divisies)
-- ───────────────────────────────────────────────────────────────────────
-- Zonder dit blijft de divisie bots-only. Hiermee wordt het een COMBI: echte
-- spelers (die deze week in dezelfde divisie zitten) worden aangevuld met bots
-- tot 30. Elke client pusht enkel zijn eigen weekstand (via SECURITY DEFINER);
-- niemand kan andermans rij aanpassen. Draai dit één keer in de Supabase
-- SQL-editor. Herhaald draaien is veilig (idempotent).
-- ═══════════════════════════════════════════════════════════════════════

create table if not exists public.league_players(
  did        text primary key,
  naam       text,
  animal_id  text,
  stage      int  not null default 0,
  division   int  not null default 0,
  week       date not null,
  xp         int  not null default 0,
  updated_at timestamptz not null default now()
);
create index if not exists league_players_week_idx
  on public.league_players(week, division, xp desc);

alter table public.league_players enable row level security;
-- Geen directe policies: alle toegang loopt via de RPC's hieronder.

-- Oude versies opruimen (return-type kan wijzigen).
do $$
declare r record;
begin
  for r in
    select p.oid::regprocedure::text as sig
      from pg_proc p join pg_namespace n on n.oid=p.pronamespace
     where n.nspname='public' and p.proname in ('league_sync','league_cohort')
  loop execute 'drop function if exists '||r.sig||' cascade'; end loop;
end $$;

-- Push mijn eigen weekstand. XP mag binnen de week niet dalen; bij een nieuwe
-- week (andere maandag-datum) reset de teller.
create or replace function public.league_sync(
  p_did text, p_naam text, p_animal text, p_stage int,
  p_division int, p_week date, p_xp int)
returns void language plpgsql security definer set search_path=public as $$
begin
  insert into public.league_players(did,naam,animal_id,stage,division,week,xp,updated_at)
  values (p_did, left(coalesce(p_naam,'Speler'),40), p_animal, greatest(0,coalesce(p_stage,0)),
          coalesce(p_division,0), p_week, greatest(0,coalesce(p_xp,0)), now())
  on conflict (did) do update set
    naam       = excluded.naam,
    animal_id  = excluded.animal_id,
    stage      = excluded.stage,
    division   = excluded.division,
    week       = excluded.week,
    xp         = case when public.league_players.week <> excluded.week
                      then excluded.xp                                   -- nieuwe week: reset
                      else greatest(public.league_players.xp, excluded.xp) end,
    updated_at = now();
end $$;
grant execute on function public.league_sync(text,text,text,int,int,date,int) to anon, authenticated;

-- Haal de echte spelers van deze week + divisie op (nieuwste activiteit eerst,
-- max 60). De client filtert zichzelf eruit en vult aan met bots tot 30.
create or replace function public.league_cohort(p_division int, p_week date)
returns table(did text, naam text, animal_id text, stage int, xp int)
language sql stable security definer set search_path=public as $$
  select did, naam, animal_id, stage, xp
    from public.league_players
   where division = p_division and week = p_week
     and updated_at > now() - interval '14 days'
   order by xp desc
   limit 60;
$$;
grant execute on function public.league_cohort(int,date) to anon, authenticated;

-- ─── KLAAR ───────────────────────────────────────────────────────────────
