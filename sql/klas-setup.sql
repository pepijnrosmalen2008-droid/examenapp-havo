-- ═══════════════════════════════════════════════════════════════════════
-- klas-setup.sql — COMPLEET klassysteem + docentendashboard voor Slagio
-- ───────────────────────────────────────────────────────────────────────
-- Draai dit ÉÉN keer, in z'n geheel, in de Supabase SQL-editor
-- (Dashboard → SQL Editor → New query → plak alles → Run).
--
-- Dit bestand is de enige bron van waarheid voor het klassysteem: het maakt
-- de tabellen én alle RPC's die de app aanroept, allemaal op elkaar afgestemd.
-- Idempotent: je kunt het veilig opnieuw draaien (tabellen worden niet
-- overschreven, functies worden vervangen door de nieuwste versie).
--
-- ⚠️  VERSE START: dit script gooit bestaande klas-tabellen eerst weg en bouwt
--     ze opnieuw op in de juiste vorm. Dat WIST bestaande klassen, leden en
--     scores. Wil je bestaande data juist behouden? Verwijder dan het
--     "DROP TABLE"-blok hieronder en stem de kolomnamen handmatig af.
--
-- Privacy: leerlingen delen alleen de voornaam die ze zelf kiezen. Geen e-mail,
-- geen user-id in het dashboard. De tabellen staan op slot (RLS aan, geen
-- policies); álle toegang loopt via SECURITY DEFINER-RPC's, met de klascode
-- als gedeelde sleutel.
-- ═══════════════════════════════════════════════════════════════════════

-- ─── 1) TABELLEN ─────────────────────────────────────────────────────────
-- ⚠️ VERSE START — wist bestaande klas-tabellen (klassen, leden, scores,
-- huiswerk) zodat ze in de juiste vorm herbouwd worden. Verwijder deze vier
-- regels als je bestaande data wilt behouden.
drop table if exists public.klas_huiswerk cascade;
drop table if exists public.klas_scores   cascade;
drop table if exists public.klas_leden    cascade;
drop table if exists public.klassen       cascade;

create table if not exists public.klassen(
  id         uuid primary key default gen_random_uuid(),
  code       text unique not null,
  naam       text,
  niveau     text,
  vak_id     text,
  owner      uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.klas_leden(
  id         bigint generated always as identity primary key,
  klas_id    uuid not null references public.klassen(id) on delete cascade,
  did        text,
  naam       text,
  created_at timestamptz not null default now(),
  unique(klas_id, did)
);
create index if not exists klas_leden_klas_idx on public.klas_leden(klas_id);

create table if not exists public.klas_scores(
  id         bigint generated always as identity primary key,
  klas_id    uuid not null references public.klassen(id) on delete cascade,
  did        text,
  naam       text,
  score      int  not null default 0,   -- leaderboardpunten 0..1000
  vak        text,
  domein     text,
  created_at timestamptz not null default now()
);
create index if not exists klas_scores_klas_idx on public.klas_scores(klas_id, created_at desc);

create table if not exists public.klas_huiswerk(
  id         bigint generated always as identity primary key,
  klas_id    uuid not null references public.klassen(id) on delete cascade,
  vak        text,
  domein     text,
  created_at timestamptz not null default now()
);
create index if not exists klas_huiswerk_klas_idx on public.klas_huiswerk(klas_id, created_at desc);

-- RLS aan, geen policies → geen enkele directe toegang; alleen de RPC's
-- hieronder (SECURITY DEFINER) mogen erbij.
alter table public.klassen      enable row level security;
alter table public.klas_leden   enable row level security;
alter table public.klas_scores  enable row level security;
alter table public.klas_huiswerk enable row level security;


-- ─── 1b) OUDE FUNCTIES OPRUIMEN ──────────────────────────────────────────
-- Draaide je eerder een andere klas-SQL, dan bestaan deze functies al, mogelijk
-- met een ander return-type. "create or replace" kan een return-type niet
-- wijzigen ("cannot change return type of existing function"), dus verwijderen
-- we elke bestaande variant eerst. Dit raakt ALLEEN de functies, niet je data.
do $$
declare r record;
begin
  for r in
    select p.oid::regprocedure::text as sig
      from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public'
       and p.proname in (
         '_klas_gen_code','klas_create','klas_join','klas_info','klas_leaderboard',
         'klas_score_add','klas_mine','klas_dashboard','klas_huiswerk_set','klas_huiswerk_get'
       )
  loop
    execute 'drop function if exists ' || r.sig || ' cascade';
  end loop;
end $$;


-- ─── 2) HULPFUNCTIE: unieke klascode (zonder verwarrende tekens) ─────────
create or replace function public._klas_gen_code()
returns text language plpgsql as $$
declare
  v_alpha constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- geen 0/O/1/I/L
  v_code  text;
  v_i     int;
begin
  loop
    v_code := '';
    for v_i in 1..6 loop
      v_code := v_code || substr(v_alpha, 1 + floor(random()*length(v_alpha))::int, 1);
    end loop;
    exit when not exists(select 1 from public.klassen where code = v_code);
  end loop;
  return v_code;
end;
$$;


-- ─── 3) DOCENT: klas aanmaken (vereist ingelogd account) ─────────────────
create or replace function public.klas_create(p_naam text, p_niveau text, p_vak_id text)
returns table(id uuid, code text)
language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_code text;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;
  v_code := public._klas_gen_code();
  insert into public.klassen(code, naam, niveau, vak_id, owner)
    values (v_code, nullif(p_naam,''), p_niveau, nullif(p_vak_id,''), auth.uid())
    returning klassen.id, klassen.code into v_id, v_code;
  return query select v_id, v_code;
end;
$$;
grant execute on function public.klas_create(text,text,text) to authenticated;


-- ─── 4) LEERLING: aansluiten met de klascode ─────────────────────────────
create or replace function public.klas_join(p_code text, p_did text, p_naam text)
returns table(id uuid, naam text, niveau text, vak_id text)
language plpgsql security definer set search_path = public as $$
declare v_k record;
begin
  select k.id, k.naam, k.niveau, k.vak_id into v_k
    from public.klassen k where upper(k.code) = upper(p_code) limit 1;
  if v_k.id is null then raise exception 'klas_niet_gevonden'; end if;
  insert into public.klas_leden(klas_id, did, naam)
    values (v_k.id, p_did, nullif(p_naam,''))
    on conflict (klas_id, did) do update set naam = excluded.naam;
  return query select v_k.id, v_k.naam, v_k.niveau, v_k.vak_id;
end;
$$;
grant execute on function public.klas_join(text,text,text) to anon, authenticated;


-- ─── 5) Aantal leden van een klas ────────────────────────────────────────
create or replace function public.klas_info(p_klas_id uuid)
returns table(leden int)
language sql security definer set search_path = public as $$
  select count(*)::int from public.klas_leden where klas_id = p_klas_id;
$$;
grant execute on function public.klas_info(uuid) to anon, authenticated;


-- ─── 6) Klas-ranglijst (punten per voornaam) ─────────────────────────────
create or replace function public.klas_leaderboard(p_klas_id uuid)
returns table(naam text, totaal int)
language sql security definer set search_path = public as $$
  select naam, coalesce(sum(score),0)::int as totaal
    from public.klas_scores
   where klas_id = p_klas_id and naam is not null
   group by naam
   order by totaal desc
   limit 100;
$$;
grant execute on function public.klas_leaderboard(uuid) to anon, authenticated;


-- ─── 7) Score toevoegen (fire-and-forget vanuit de quiz) ─────────────────
create or replace function public.klas_score_add(
  p_klas_id uuid, p_did text, p_naam text, p_score int, p_vak text, p_domein text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_score is null or p_score <= 0 then return; end if;
  insert into public.klas_scores(klas_id, did, naam, score, vak, domein)
    values (p_klas_id, p_did, coalesce(nullif(p_naam,''),'Leerling'), p_score, p_vak, p_domein);
end;
$$;
grant execute on function public.klas_score_add(uuid,text,text,int,text,text) to anon, authenticated;


-- ─── 8) "Mijn klassen" (probe + docentoverzicht) ─────────────────────────
create or replace function public.klas_mine()
returns table(id uuid, naam text, code text, niveau text, vak_id text)
language sql security definer set search_path = public as $$
  select id, naam, code, niveau, vak_id
    from public.klassen
   where owner = auth.uid()
   order by created_at desc;
$$;
grant execute on function public.klas_mine() to anon, authenticated;


-- ─── 9) DOCENTENDASHBOARD: alles-in-één per klascode ─────────────────────
-- Geeft ALLEEN geaggregeerde data terug: voornamen + klasgemiddelden.
-- beheersing% = score/1000. groei = gem. laatste 14 dagen − de 14 dagen ervoor.
-- Leerlingen die nog nooit oefenden staan er óók in (gem 0, "nooit actief") —
-- juist die wil de docent zien.
create or replace function public.klas_dashboard(p_code text)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_klas   record;
  v_result jsonb;
begin
  select id, code, naam, niveau, vak_id into v_klas
    from public.klassen where upper(code) = upper(p_code) limit 1;
  if v_klas.id is null then
    return jsonb_build_object('klas', null);
  end if;

  with leden as (
    select distinct naam from public.klas_leden
     where klas_id = v_klas.id and naam is not null and naam <> ''
  ),
  s as (
    select naam, score, vak, domein, created_at
      from public.klas_scores where klas_id = v_klas.id
  ),
  per_student as (
    select l.naam,
           count(sc.created_at)::int                                   as sessies,
           coalesce(sum(sc.score),0)::int                              as punten,
           case when count(sc.created_at)=0 then 0
                else round((avg(sc.score)/1000.0)::numeric,3) end      as gem,
           case when max(sc.created_at) is null then null
                else floor(extract(epoch from (now()-max(sc.created_at)))/86400)::int
           end                                                         as laatst_actief_dagen,
           round(((
             coalesce(avg(sc.score) filter (where sc.created_at >  now()-interval '14 day'),0)
           - coalesce(avg(sc.score) filter (where sc.created_at <= now()-interval '14 day'
                                              and  sc.created_at >  now()-interval '28 day'),0)
           )/1000.0)::numeric,3)                                       as groei
      from leden l
      left join s sc on sc.naam = l.naam
      group by l.naam
  ),
  per_student_domein as (
    select naam, vak, domein, avg(score)/1000.0 as g, count(*) as c
      from s where domein is not null group by naam, vak, domein
  ),
  per_domein as (
    select vak, domein,
           round(avg(g)::numeric,3)              as gem,
           sum(c)::int                           as sessies,
           count(*) filter (where g < 0.55)::int as zwak
      from per_student_domein group by vak, domein
  )
  select jsonb_build_object(
    'klas', jsonb_build_object(
      'naam', v_klas.naam, 'niveau', v_klas.niveau, 'vak', v_klas.vak_id, 'code', v_klas.code,
      'leden',          (select count(*) from public.klas_leden where klas_id = v_klas.id),
      'sessies_week',   (select count(*) from s where created_at > now()-interval '7 day'),
      'gem_beheersing', (select round((avg(score)/1000.0)::numeric,3) from s)
    ),
    'leerlingen', coalesce((select jsonb_agg(to_jsonb(per_student)) from per_student), '[]'::jsonb),
    'domeinen',   coalesce((select jsonb_agg(to_jsonb(per_domein))  from per_domein),  '[]'::jsonb)
  ) into v_result;
  return v_result;
end;
$$;
grant execute on function public.klas_dashboard(text) to anon, authenticated;


-- ─── 10) ÉÉN-KLIK HUISWERK: docent zet oefenset klaar, leerling ziet 'm ───
-- Docent (via klascode) zet huiswerk klaar. Zelfde onderwerp binnen 12u = geen dubbele.
create or replace function public.klas_huiswerk_set(p_code text, p_vak text, p_domein text)
returns void language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  select id into v_id from public.klassen where upper(code)=upper(p_code) limit 1;
  if v_id is null then raise exception 'klas_niet_gevonden'; end if;
  if exists(select 1 from public.klas_huiswerk
             where klas_id=v_id and vak=p_vak and domein=p_domein
               and created_at > now()-interval '12 hour') then
    return;
  end if;
  insert into public.klas_huiswerk(klas_id, vak, domein) values (v_id, p_vak, p_domein);
end;
$$;
grant execute on function public.klas_huiswerk_set(text,text,text) to anon, authenticated;

-- Leerling haalt het actuele huiswerk op (laatste 7 dagen, nieuwste eerst).
create or replace function public.klas_huiswerk_get(p_klas_id uuid)
returns table(vak text, domein text, created_at timestamptz)
language sql security definer set search_path = public as $$
  select vak, domein, created_at from public.klas_huiswerk
   where klas_id = p_klas_id and created_at > now()-interval '7 day'
   order by created_at desc limit 5;
$$;
grant execute on function public.klas_huiswerk_get(uuid) to anon, authenticated;


-- ─── KLAAR ───────────────────────────────────────────────────────────────
-- Test het dashboard (vervang JOUWCODE door een echte klascode):
--   select public.klas_dashboard('JOUWCODE');
-- Of open in de browser: /docent.html?code=JOUWCODE
