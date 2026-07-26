-- ═══════════════════════════════════════════════════════════════════════
-- klas-dashboard.sql — Docentendashboard-RPC voor Slagio (docent.html)
-- ───────────────────────────────────────────────────────────────────────
-- Draai dit één keer in de Supabase SQL-editor (SQL Editor → New query → Run).
--
-- AANNAMES over je bestaande klas-schema (uit klas-supabase.sql). Wijken je
-- tabel-/kolomnamen af? Pas ze dan alleen hieronder aan — de rest werkt mee:
--
--   klassen(id, code, naam, niveau, vak_id)
--   klas_scores(klas_id, naam, score, vak, domein, created_at)
--     · score = leaderboardpunten 0..1000 (zoals klas_score_add die opslaat)
--     · beheersing% wordt afgeleid als score/1000
--
-- Privacy: deze functie geeft ALLEEN geaggregeerde data terug (voornamen die de
-- leerling zelf in de klas koos + klasgemiddelden). Geen e-mail, geen user-id.
-- SECURITY DEFINER + toegang op klascode (de gedeelde klas-sleutel).
-- ═══════════════════════════════════════════════════════════════════════

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
  select id, code, naam, niveau, vak_id
    into v_klas
    from klassen
   where upper(code) = upper(p_code)
   limit 1;

  if v_klas.id is null then
    return jsonb_build_object('klas', null);
  end if;

  with s as (
    select naam, score, vak, domein, created_at
      from klas_scores
     where klas_id = v_klas.id
  ),
  -- per leerling
  per_student as (
    select naam,
           count(*)::int                                    as sessies,
           coalesce(sum(score),0)::int                      as punten,
           round((avg(score)/1000.0)::numeric, 3)           as gem,
           extract(day from (now() - max(created_at)))::int as laatst_actief_dagen
      from s
     group by naam
  ),
  -- per leerling × domein (basis voor domein-gemiddelde en 'zwak')
  per_student_domein as (
    select naam, vak, domein,
           avg(score)/1000.0 as g,
           count(*)          as c
      from s
     group by naam, vak, domein
  ),
  per_domein as (
    select vak, domein,
           round(avg(g)::numeric, 3)             as gem,      -- gemiddelde van leerling-gemiddelden
           sum(c)::int                           as sessies,
           count(*) filter (where g < 0.55)::int as zwak      -- # leerlingen onder 55%
      from per_student_domein
     group by vak, domein
  ),
  -- activiteit per dag, laatste 14 dagen
  activiteit as (
    select to_char(d.day, 'Dy')                  as dag,
           coalesce(count(s.created_at), 0)::int as n
      from generate_series(current_date - interval '13 day', current_date, interval '1 day') d(day)
      left join s on s.created_at::date = d.day
     group by d.day
     order by d.day
  )
  select jsonb_build_object(
    'klas', jsonb_build_object(
      'naam',           v_klas.naam,
      'niveau',         v_klas.niveau,
      'vak',            v_klas.vak_id,
      'code',           v_klas.code,
      'leden',          (select count(distinct naam) from s),
      'sessies_week',   (select count(*) from s where created_at > now() - interval '7 day'),
      'gem_beheersing', (select round((avg(score)/1000.0)::numeric,3) from s)
    ),
    'leerlingen', coalesce((select jsonb_agg(to_jsonb(per_student))  from per_student),  '[]'::jsonb),
    'domeinen',   coalesce((select jsonb_agg(to_jsonb(per_domein))   from per_domein),   '[]'::jsonb),
    'activiteit', coalesce((select jsonb_agg(to_jsonb(activiteit))   from activiteit),   '[]'::jsonb)
  )
  into v_result;

  return v_result;
end;
$$;

-- De anon-key mag de RPC aanroepen (toegang wordt afgeschermd door de klascode).
grant execute on function public.klas_dashboard(text) to anon, authenticated;

-- Test: select public.klas_dashboard('JOUWCODE');
