-- Teranga Saveurs : tables, RLS, stockage, RPC
-- À appliquer via Supabase Dashboard > SQL > New query, ou : supabase db push

create table if not exists public.restaurant_settings (
  id smallint primary key default 1 check (id = 1),
  is_open boolean not null default true,
  hero_image_url text not null default '',
  whatsapp_e164 text not null default '',
  site_visits bigint not null default 0,
  last_visit_at timestamptz,
  admin_updates int not null default 0,
  last_admin_update_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.dishes (
  id text primary key check (id in ('1', '2')),
  name text not null default '',
  description text not null default '',
  price numeric(10, 2) not null default 0,
  image_url text not null default '',
  updated_at timestamptz not null default now()
);

insert into public.restaurant_settings (id, is_open, hero_image_url, whatsapp_e164)
values (
    1,
    true,
    'https://images.unsplash.com/photo-1665400808116-f0e6339b7e9a?auto=format&fit=crop&w=1920&q=80',
    '33600000000'
  )
on conflict (id) do nothing;

insert into public.dishes (id, name, description, price, image_url)
values
  (
    '1',
    'Thiéboudiène du jour',
    'Riz parfumé, poisson, légumes de saison et sauce tomate corsée — le plat national, servi avec générosité.',
    14.5,
    'https://images.unsplash.com/photo-1665332195309-9d75071138f0?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    '2',
    'Yassa poulet',
    'Poulet mariné aux oignons caramélisés, citron et moutarde douce, riz basmati parfumé.',
    13,
    'https://images.unsplash.com/photo-1664992960082-0ea299a9c53e?auto=format&fit=crop&w=1200&q=80'
  )
on conflict (id) do nothing;

-- Visites site (appel public, sans auth)
create or replace function public.increment_site_visits()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.restaurant_settings
  set
    site_visits = site_visits + 1,
    last_visit_at = now(),
    updated_at = now()
  where id = 1;
end;
$$;

grant execute on function public.increment_site_visits() to anon, authenticated;

-- Compteur admin (une fois après sauvegarde / upload)
create or replace function public.finish_admin_edit()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.restaurant_settings
  set
    admin_updates = admin_updates + 1,
    last_admin_update_at = now(),
    updated_at = now()
  where id = 1;
end;
$$;

grant execute on function public.finish_admin_edit() to authenticated;

alter table public.restaurant_settings enable row level security;
alter table public.dishes enable row level security;

drop policy if exists "settings_select_all" on public.restaurant_settings;
create policy "settings_select_all" on public.restaurant_settings for select using (true);

drop policy if exists "settings_update_auth" on public.restaurant_settings;
create policy "settings_update_auth" on public.restaurant_settings for update to authenticated using (true)
with
  check (true);

drop policy if exists "dishes_select_all" on public.dishes;
create policy "dishes_select_all" on public.dishes for select using (true);

drop policy if exists "dishes_update_auth" on public.dishes;
create policy "dishes_update_auth" on public.dishes for update to authenticated using (true)
with
  check (true);

-- Bucket images (lecture publique, écriture réservée aux comptes connectés)
insert into storage.buckets (id, name, public)
values ('dish-images', 'dish-images', true)
on conflict (id) do nothing;

drop policy if exists "dish_images_public_read" on storage.objects;
create policy "dish_images_public_read" on storage.objects for select using (bucket_id = 'dish-images');

drop policy if exists "dish_images_auth_insert" on storage.objects;
create policy "dish_images_auth_insert" on storage.objects for insert to authenticated
with
  check (bucket_id = 'dish-images');

drop policy if exists "dish_images_auth_update" on storage.objects;
create policy "dish_images_auth_update" on storage.objects for update to authenticated using (bucket_id = 'dish-images')
with
  check (bucket_id = 'dish-images');

drop policy if exists "dish_images_auth_delete" on storage.objects;
create policy "dish_images_auth_delete" on storage.objects for delete to authenticated using (bucket_id = 'dish-images');
