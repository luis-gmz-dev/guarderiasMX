-- Mapa de guarderías.
-- Ejecutar en el SQL Editor de Supabase (rol postgres, sin JWT).
-- No colocar la clave service_role en el frontend.
--
-- Primer administrador, después de crearlo en Authentication:
--   insert into public.profiles (id, rol)
--   values ('UUID-DEL-USUARIO', 'admin');

create extension if not exists pgcrypto;

create table public.guarderias (
  id uuid primary key default gen_random_uuid(),
  clave_presupuestal text not null unique,
  nombre text not null,
  horario_atencion text,
  telefono text,
  calle text,
  numero_exterior text,
  numero_interior text,
  estado text,
  localidad text,
  municipio text,
  colonia text,
  codigo_postal text,
  latitud double precision not null,
  longitud double precision not null,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint guarderias_latitud_rango check (latitud between -90 and 90),
  constraint guarderias_longitud_rango check (longitud between -180 and 180)
);

create index guarderias_estado_idx on public.guarderias (estado);
create index guarderias_municipio_idx on public.guarderias (municipio);
create index guarderias_activo_idx on public.guarderias (activo);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  rol text not null,
  created_at timestamptz not null default now(),
  constraint profiles_rol_admin check (rol = 'admin')
);

create table public.importaciones (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references auth.users (id),
  archivo text,
  total_filas integer not null,
  insertados integer not null,
  actualizados integer not null,
  estado text not null,
  detalle jsonb,
  created_at timestamptz not null default now(),
  constraint importaciones_estado check (estado in ('ok', 'error'))
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger guarderias_set_updated_at
before update on public.guarderias
for each row
execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and rol = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.profiles_bloquear_autogestion()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if auth.uid() is not null then
    raise exception 'No autorizado para modificar perfiles';
  end if;
  return new;
end;
$$;

create trigger profiles_bloquear_autogestion
before insert or update on public.profiles
for each row
execute function public.profiles_bloquear_autogestion();

create or replace function public.importar_guarderias(filas jsonb, archivo text default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  total integer;
  i integer;
  fila jsonb;
  clave text;
  nombre text;
  horario text;
  telefono text;
  calle text;
  numero_exterior text;
  numero_interior text;
  estado text;
  localidad text;
  municipio text;
  colonia text;
  codigo_postal text;
  lat double precision;
  lng double precision;
  claves text[] := '{}';
  normalizadas jsonb := '[]'::jsonb;
  advertencias jsonb := '[]'::jsonb;
  insertados integer := 0;
  actualizados integer := 0;
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception 'No autorizado';
  end if;

  if filas is null or jsonb_typeof(filas) <> 'array' or jsonb_array_length(filas) = 0 then
    raise exception 'El archivo no contiene filas';
  end if;

  total := jsonb_array_length(filas);

  for i in 0 .. total - 1 loop
    fila := filas -> i;
    clave := nullif(btrim(coalesce(fila ->> 'clave_presupuestal', '')), '');
    if clave is null then
      raise exception 'Fila %: clave presupuestal vacía', i + 1;
    end if;
    if clave = any (claves) then
      raise exception 'Clave repetida en el archivo: %', clave;
    end if;
    claves := array_append(claves, clave);

    nombre := nullif(btrim(coalesce(fila ->> 'nombre', '')), '');
    if nombre is null then
      raise exception 'Fila % (%): nombre vacío', i + 1, clave;
    end if;

    begin
      lat := (fila ->> 'latitud')::double precision;
      lng := (fila ->> 'longitud')::double precision;
    exception
      when others then
        raise exception 'Fila % (%): coordenadas inválidas', i + 1, clave;
    end;

    if lat is null or lng is null then
      raise exception 'Fila % (%): coordenadas vacías', i + 1, clave;
    end if;

    if lat between 14 and 33 and lng > 0 and (-lng) between -118.5 and -86 then
      lng := -lng;
      advertencias := advertencias || jsonb_build_array(
        jsonb_build_object(
          'clave_presupuestal', clave,
          'mensaje', 'Longitud positiva corregida a negativa para ubicarla en México.'
        )
      );
    end if;

    if lat < 14 or lat > 33 or lng < -118.5 or lng > -86 then
      raise exception 'Fila % (%): coordenadas fuera de México', i + 1, clave;
    end if;

    horario := nullif(btrim(coalesce(fila ->> 'horario_atencion', '')), '');
    telefono := nullif(btrim(coalesce(fila ->> 'telefono', '')), '');
    calle := nullif(btrim(coalesce(fila ->> 'calle', '')), '');
    numero_exterior := nullif(btrim(coalesce(fila ->> 'numero_exterior', '')), '');
    numero_interior := nullif(btrim(coalesce(fila ->> 'numero_interior', '')), '');
    estado := nullif(btrim(coalesce(fila ->> 'estado', '')), '');
    localidad := nullif(btrim(coalesce(fila ->> 'localidad', '')), '');
    municipio := nullif(btrim(coalesce(fila ->> 'municipio', '')), '');
    colonia := nullif(btrim(coalesce(fila ->> 'colonia', '')), '');
    codigo_postal := nullif(btrim(coalesce(fila ->> 'codigo_postal', '')), '');

    if codigo_postal is not null and codigo_postal ~ '^[0-9]+$' and char_length(codigo_postal) < 5 then
      codigo_postal := lpad(codigo_postal, 5, '0');
    end if;
    if codigo_postal is not null and codigo_postal !~ '^[0-9]{5}$' then
      raise exception 'Fila % (%): código postal inválido', i + 1, clave;
    end if;

    normalizadas := normalizadas || jsonb_build_array(
      jsonb_build_object(
        'clave_presupuestal', clave,
        'nombre', nombre,
        'horario_atencion', horario,
        'telefono', telefono,
        'calle', calle,
        'numero_exterior', numero_exterior,
        'numero_interior', numero_interior,
        'estado', estado,
        'localidad', localidad,
        'municipio', municipio,
        'colonia', colonia,
        'codigo_postal', codigo_postal,
        'latitud', lat,
        'longitud', lng
      )
    );
  end loop;

  select count(*)
  into actualizados
  from jsonb_array_elements(normalizadas) as item
  join public.guarderias as guarderia
    on guarderia.clave_presupuestal = item ->> 'clave_presupuestal';

  insertados := total - actualizados;

  insert into public.guarderias (
    clave_presupuestal,
    nombre,
    horario_atencion,
    telefono,
    calle,
    numero_exterior,
    numero_interior,
    estado,
    localidad,
    municipio,
    colonia,
    codigo_postal,
    latitud,
    longitud
  )
  select
    item ->> 'clave_presupuestal',
    item ->> 'nombre',
    item ->> 'horario_atencion',
    item ->> 'telefono',
    item ->> 'calle',
    item ->> 'numero_exterior',
    item ->> 'numero_interior',
    item ->> 'estado',
    item ->> 'localidad',
    item ->> 'municipio',
    item ->> 'colonia',
    item ->> 'codigo_postal',
    (item ->> 'latitud')::double precision,
    (item ->> 'longitud')::double precision
  from jsonb_array_elements(normalizadas) as item
  on conflict (clave_presupuestal) do update
  set
    nombre = excluded.nombre,
    horario_atencion = excluded.horario_atencion,
    telefono = excluded.telefono,
    calle = excluded.calle,
    numero_exterior = excluded.numero_exterior,
    numero_interior = excluded.numero_interior,
    estado = excluded.estado,
    localidad = excluded.localidad,
    municipio = excluded.municipio,
    colonia = excluded.colonia,
    codigo_postal = excluded.codigo_postal,
    latitud = excluded.latitud,
    longitud = excluded.longitud;

  insert into public.importaciones (
    admin_id,
    archivo,
    total_filas,
    insertados,
    actualizados,
    estado,
    detalle
  )
  values (
    auth.uid(),
    nullif(btrim(coalesce(archivo, '')), ''),
    total,
    insertados,
    actualizados,
    'ok',
    jsonb_build_object('advertencias', advertencias)
  );

  return jsonb_build_object(
    'insertados', insertados,
    'actualizados', actualizados,
    'advertencias', advertencias
  );
end;
$$;

revoke all on function public.importar_guarderias(jsonb, text) from public;
revoke all on function public.importar_guarderias(jsonb, text) from anon;
grant execute on function public.importar_guarderias(jsonb, text) to authenticated;

alter table public.guarderias enable row level security;
alter table public.profiles enable row level security;
alter table public.importaciones enable row level security;

create policy guarderias_select
on public.guarderias
for select
to anon, authenticated
using (activo = true or public.is_admin());

create policy guarderias_insert
on public.guarderias
for insert
to authenticated
with check (public.is_admin());

create policy guarderias_update
on public.guarderias
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy profiles_select
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.is_admin());

create policy importaciones_select
on public.importaciones
for select
to authenticated
using (public.is_admin());

revoke all on public.guarderias from anon, authenticated;
grant select on public.guarderias to anon, authenticated;
grant insert, update on public.guarderias to authenticated;

revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;

revoke all on public.importaciones from anon, authenticated;
grant select on public.importaciones to authenticated;
