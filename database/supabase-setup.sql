-- THAI RONG PLENG PALEMBANG - Supabase setup
-- Jalankan seluruh file ini di Supabase > SQL Editor > New query.

create extension if not exists pgcrypto;

create table if not exists public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_site_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.site_admins where user_id = auth.uid());
$$;

grant execute on function public.is_site_admin() to anon, authenticated;

create table if not exists public.artists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default 'ACTOR',
  slug text not null unique,
  image_url text,
  bio text,
  birthday date,
  nationality text,
  instagram text,
  status text not null default 'draft' check (status in ('draft','published')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.series (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null check (category in ('BL','GL')),
  poster_url text,
  genre text,
  release_year integer,
  cast_names text,
  synopsis text,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null default 'ANNOUNCEMENT',
  image_url text,
  excerpt text,
  content text,
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  hero_image_url text,
  content text,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

-- RLS: pengunjung hanya dapat membaca konten Published; admin dapat mengelola semua.
alter table public.site_admins enable row level security;
alter table public.artists enable row level security;
alter table public.series enable row level security;
alter table public.news enable row level security;
alter table public.pages enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Public reads published artists" on public.artists;
create policy "Public reads published artists" on public.artists for select to anon, authenticated using (status = 'published');
drop policy if exists "Admins manage artists" on public.artists;
create policy "Admins manage artists" on public.artists for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());

drop policy if exists "Public reads published series" on public.series;
create policy "Public reads published series" on public.series for select to anon, authenticated using (status = 'published');
drop policy if exists "Admins manage series" on public.series;
create policy "Admins manage series" on public.series for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());

drop policy if exists "Public reads published news" on public.news;
create policy "Public reads published news" on public.news for select to anon, authenticated using (status = 'published');
drop policy if exists "Admins manage news" on public.news;
create policy "Admins manage news" on public.news for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());

drop policy if exists "Public reads published pages" on public.pages;
create policy "Public reads published pages" on public.pages for select to anon, authenticated using (status = 'published');
drop policy if exists "Admins manage pages" on public.pages;
create policy "Admins manage pages" on public.pages for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());

drop policy if exists "Public reads site settings" on public.site_settings;
create policy "Public reads site settings" on public.site_settings for select to anon, authenticated using (true);
drop policy if exists "Admins manage site settings" on public.site_settings;
create policy "Admins manage site settings" on public.site_settings for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());

-- Media bucket. File URL is public so the website can display it; only admins can upload/change/delete.
insert into storage.buckets (id, name, public) values ('site-media','site-media',true) on conflict (id) do nothing;
drop policy if exists "Public can view site media" on storage.objects;
create policy "Public can view site media" on storage.objects for select to anon, authenticated using (bucket_id = 'site-media');
drop policy if exists "Admins upload site media" on storage.objects;
create policy "Admins upload site media" on storage.objects for insert to authenticated with check (bucket_id = 'site-media' and public.is_site_admin());
drop policy if exists "Admins update site media" on storage.objects;
create policy "Admins update site media" on storage.objects for update to authenticated using (bucket_id = 'site-media' and public.is_site_admin()) with check (bucket_id = 'site-media' and public.is_site_admin());
drop policy if exists "Admins delete site media" on storage.objects;
create policy "Admins delete site media" on storage.objects for delete to authenticated using (bucket_id = 'site-media' and public.is_site_admin());

-- Demo content based on the content already present in the original index.html.
insert into public.artists (name,role,slug,image_url,bio,status,sort_order) values
('Artist Name 01','ACTOR','artist-name-01','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=700','Profil talent akan dilengkapi oleh administrator.','published',1),
('Artist Name 02','ACTRESS','artist-name-02','https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=700','Profil talent akan dilengkapi oleh administrator.','published',2),
('Artist Name 03','ACTOR','artist-name-03','https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=700','Profil talent akan dilengkapi oleh administrator.','published',3),
('Artist Name 04','ACTRESS','artist-name-04','https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=700','Profil talent akan dilengkapi oleh administrator.','published',4)
on conflict (slug) do nothing;

insert into public.series (title,slug,category,poster_url,genre,release_year,synopsis,status) values
('Beyond The Summer','beyond-the-summer','BL','https://images.unsplash.com/photo-1517841905240-472988babdf9?w=700','Romance · Drama',2026,'Sinopsis serial akan dilengkapi oleh administrator.','published'),
('Our Secret Chapter','our-secret-chapter','BL','https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=700','Romance · Youth',2026,'Sinopsis serial akan dilengkapi oleh administrator.','published'),
('Midnight Promise','midnight-promise','BL','https://images.unsplash.com/photo-1504198322253-cfa87a0ff25f?w=700','Romance · Mystery',2026,'Sinopsis serial akan dilengkapi oleh administrator.','published'),
('When We Meet Again','when-we-meet-again','GL','https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=700','Romance · Drama',2026,'Sinopsis serial akan dilengkapi oleh administrator.','published'),
('Her Favorite Color','her-favorite-color','GL','https://images.unsplash.com/photo-1517841905240-472988babdf9?w=700','Romance · Youth',2026,'Sinopsis serial akan dilengkapi oleh administrator.','published'),
('Love in Bloom','love-in-bloom','GL','https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=700','Romance · Slice of Life',2026,'Sinopsis serial akan dilengkapi oleh administrator.','published')
on conflict (slug) do nothing;

insert into public.news (title,slug,category,image_url,excerpt,content,status,published_at) values
('New Projects Coming Soon!','new-projects-coming-soon','ANNOUNCEMENT','https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=700','Stay tuned for the latest projects from our entertainment team.','Stay tuned for the latest projects from our entertainment team.','published',now()),
('Meet Our Artists','meet-our-artists','EVENT','https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=700','Discover upcoming activities and special moments with our talents.','Discover upcoming activities and special moments with our talents.','published',now()),
('Behind Every Great Story','behind-every-great-story','BEHIND THE SCENES','https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=700','Take a look at the creative process behind our productions.','Take a look at the creative process behind our productions.','published',now())
on conflict (slug) do nothing;

insert into public.site_settings (key,value) values
('hero_eyebrow','THAI ENTERTAINMENT COMPANY'),('hero_title','Stories That'),('hero_highlight','Connect'),('hero_suffix','Hearts.'),
('hero_description','Discover new talents, unforgettable stories, and exciting entertainment from THAI RONG PLENG PALEMBANG. A home for artists and extraordinary stories.'),
('hero_image','https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1800'),
('footer_description','A home for talents, stories, and entertainment. Creating memorable experiences through film, television, music, and live events.'),
('about_content','THAI RONG PLENG PALEMBANG adalah rumah bagi talenta, cerita, dan hiburan. Kami menghadirkan pengalaman melalui film, televisi, musik, dan acara langsung.'),
('contact_address','Palembang, Indonesia')
on conflict (key) do nothing;

-- LANGKAH ADMIN:
-- 1. Buat user di Supabase > Authentication > Users > Add user.
-- 2. Salin User UID milik akun admin tersebut.
-- 3. Jalankan query ini secara terpisah dengan mengganti UUID:
-- insert into public.site_admins (user_id) values ('GANTI-DENGAN-USER-UID');
