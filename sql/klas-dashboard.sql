-- ═══════════════════════════════════════════════════════════════════════
-- klas-dashboard.sql — Docentendashboard + één-klik-huiswerk voor Slagio
-- ───────────────────────────────────────────────────────────────────────
-- Draai dit één keer in de Supabase SQL-editor (SQL Editor → New query → Run).
--
-- AANNAMES over je bestaande klas-schema (uit klas-supabase.sql). Wijken je
-- tabel-/kolomnamen af? Pas ze dan alleen hier aan — de rest werkt mee:
--   klassen(id, code, naam, niveau, vak_id)
--   klas_scores(klas_id, naam, score, vak, domein, created_at)
--     · score = leaderboardpunten 0..1000 (zoals klas_score_add opslaat)
--     · beheersing% wordt afgeleid als score/1000
--
-- Privacy: geeft ALLEEN geaggregeerde data terug (voornamen die de leerling
-- zelf koos + klasgemiddelden). Geen e-mail, geen user-id. SECURITY DEFINER,
-- toegang via de klascode (de gedeelde klas-sleutel).
-- ═══════════════════════════════════════════════════════════════════════

-- 1) DASHBOARD-DATA ───────────────────────────────────────────────────────
create or replace function public.klas_dashboard(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_klas   record;
  v_result jsonb;
begin
  select id, code, naam, niveau, vak_id into v_klas
    from klassen where upper(code) = upper(p_code) limit 1;
  if v_klas.id is null then
    return jsonb_build_object('klas', null);
  end if;

  with s as (
    select naam, score, vak, domein, created_at
      from klas_scores where klas_id = v_klas.id
  ),
  per_student as (
    select naam,
           count(*)::int                                    as sessies,
           coalesce(sum(score),0)::int                      as punten,
           round((avg(score)/1000.0)::numeric,3)            as gem,
           extract(day from (now()-max(created_at)))::int   as laatst_actief_dagen,
           -- groei = gem. laatste 14 dagen  minus  gem. de 14 dagen daarvoor
           round(((
             coalesce(avg(score) filter (where created_at > now()-interval '14 day'),0)
           - coalesce(avg(score) filter (where created_at <= now()-interval '14 day'
                                          and created_at > now()-interval '28 day'),0)
           )/1000.0)::numeric,3)                            as groei
      from s group by naam
  ),
  per_student_domein as (
    select naam, vak, domein, avg(score)/1000.0 as g, count(*) as c
      from s group by naam, vak, domein
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
      'leden',          (select count(distinct naam) from s),
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


-- 2) ÉÉN-KLIK HUISWERK: docent zet een oefenset klaar, leerling ziet 'm ─────
create table if not exists public.klas_huiswerk(
  id         bigint generated always as identity primary key,
  klas_id    uuid not null,
  vak        text,
  domein     text,
  created_at timestamptz not null default now()
);
create index if not exists klas_huiswerk_klas_idx on public.klas_huiswerk(klas_id, created_at desc);

-- Docent (via klascode) zet huiswerk klaar. Zelfde onderwerp binnen 12u = update.
create or replace function public.klas_huiswerk_set(p_code text, p_vak text, p_domein text)
returns void language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  select id into v_id from klassen where upper(code)=upper(p_code) limit 1;
  if v_id is null then raise exception 'klas_niet_gevonden'; end if;
  if exists(select 1 from klas_huiswerk
             where klas_id=v_id and vak=p_vak and domein=p_domein
               and created_at > now()-interval '12 hour') then
    return;
  end if;
  insert into klas_huiswerk(klas_id, vak, domein) values (v_id, p_vak, p_domein);
end;
$$;
grant execute on function public.klas_huiswerk_set(text,text,text) to anon, authenticated;

-- Leerling haalt het actuele huiswerk van de klas op (laatste 7 dagen).
create or replace function public.klas_huiswerk_get(p_klas_id uuid)
returns table(vak text, domein text, created_at timestamptz)
language sql security definer set search_path = public as $$
  select vak, domein, created_at from klas_huiswerk
   where klas_id = p_klas_id and created_at > now()-interval '7 day'
   order by created_at desc limit 5;
$$;
grant execute on function public.klas_huiswerk_get(uuid) to anon, authenticated;

-- Test: select public.klas_dashboard('JOUWCODE');
