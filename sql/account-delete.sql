-- ═══════════════════════════════════════════════════════════════════════
-- account-delete.sql — "verwijder mijn account" (AVG-recht op vergetelheid +
-- App Store-eis 5.1.1(v)). Draai dit één keer in de Supabase SQL-editor.
-- De app roept public.account_delete(p_did) aan vanuit Profiel → Gegevens.
-- ═══════════════════════════════════════════════════════════════════════

-- SECURITY DEFINER: draait als de eigenaar, dus met rechten om ook de rij in
-- auth.users te verwijderen. Elke delete is tolerant (mist een tabel/kolom in
-- jouw schema, dan slaat die stap stil over) zodat de functie altijd werkt.
create or replace function public.account_delete(p_did text default null)
returns void language plpgsql security definer set search_path = public as $$
declare v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'auth_required'; end if;

  begin delete from public.leaderboard where user_id = v_uid; exception when undefined_table or undefined_column then null; end;
  begin delete from public.events      where user_id = v_uid; exception when undefined_table or undefined_column then null; end;

  -- profiel: probeer beide gangbare sleutelkolommen (user_id of id = auth.uid())
  begin delete from public.profiel where user_id = v_uid; exception when undefined_table or undefined_column then null; end;
  begin delete from public.profiel where id = v_uid;      exception when undefined_table or undefined_column then null; end;

  -- pseudonieme device-data + klaslidmaatschappen (op did), indien meegegeven
  if p_did is not null and p_did <> '' then
    begin delete from public.events      where meta->>'did' = p_did; exception when undefined_table or undefined_column then null; end;
    begin delete from public.klas_leden  where did = p_did;         exception when undefined_table or undefined_column then null; end;
    begin delete from public.klas_scores where did = p_did;         exception when undefined_table or undefined_column then null; end;
  end if;

  -- het account zelf (de rij in auth.users = het e-mailadres)
  begin delete from auth.users where id = v_uid; exception when others then null; end;
end;
$$;
grant execute on function public.account_delete(text) to anon, authenticated;

-- Test (als ingelogde gebruiker): select public.account_delete(null);
