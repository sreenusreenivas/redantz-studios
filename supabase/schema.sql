-- RedAntz Studios — Supabase Schema
-- Run in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── PORTFOLIOS ────────────────────────────────────────────────────────────────
create table if not exists portfolios (
  id             uuid primary key default uuid_generate_v4(),
  slug           text not null unique,
  couple_names   text not null,
  event_type     text not null default 'Wedding',
  date           text,
  location       text,
  photographer   text default 'RedAntz Studios',
  cover_image    text,
  excerpt        text,
  published      boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists portfolios_published_idx on portfolios(published);
create index if not exists portfolios_slug_idx on portfolios(slug);

-- ─── PORTFOLIO PHOTOS ──────────────────────────────────────────────────────────
create table if not exists portfolio_photos (
  id             uuid primary key default uuid_generate_v4(),
  portfolio_id   uuid not null references portfolios(id) on delete cascade,
  public_id      text not null,
  url            text not null,
  thumb_url      text,
  width          int,
  height         int,
  category       text not null default 'ceremony',
  caption        text,
  display_order  int not null default 0,
  created_at     timestamptz not null default now()
);

create index if not exists portfolio_photos_portfolio_id_idx on portfolio_photos(portfolio_id);

-- ─── CLIENT GALLERIES ──────────────────────────────────────────────────────────
create table if not exists client_galleries (
  id             uuid primary key default uuid_generate_v4(),
  gallery_id     text not null unique,          -- URL-safe short ID used in /client/[galleryId]
  couple_names   text not null,
  event_type     text not null default 'Wedding',
  date           text,
  location       text,
  cover_image    text,
  total_photos   int not null default 0,
  password_hash  text not null,
  active         boolean not null default true,
  expires_at     timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists client_galleries_gallery_id_idx on client_galleries(gallery_id);

-- ─── CLIENT PHOTOS ─────────────────────────────────────────────────────────────
create table if not exists client_photos (
  id             uuid primary key default uuid_generate_v4(),
  gallery_id     uuid not null references client_galleries(id) on delete cascade,
  public_id      text not null,
  url            text not null,
  thumb_url      text,
  width          int,
  height         int,
  category       text not null default 'all',
  display_order  int not null default 0,
  created_at     timestamptz not null default now()
);

create index if not exists client_photos_gallery_id_idx on client_photos(gallery_id);

-- ─── RLS POLICIES ──────────────────────────────────────────────────────────────
-- Enable RLS
alter table portfolios enable row level security;
alter table portfolio_photos enable row level security;
alter table client_galleries enable row level security;
alter table client_photos enable row level security;

-- Portfolios: public can read published, authenticated can do anything
create policy "Public can view published portfolios"
  on portfolios for select
  using (published = true);

create policy "Authenticated users manage portfolios"
  on portfolios for all
  using (auth.uid() is not null);

-- Portfolio photos: public can read if portfolio is published
create policy "Public can view photos of published portfolios"
  on portfolio_photos for select
  using (
    exists (
      select 1 from portfolios
      where portfolios.id = portfolio_photos.portfolio_id
        and portfolios.published = true
    )
  );

create policy "Authenticated users manage portfolio photos"
  on portfolio_photos for all
  using (auth.uid() is not null);

-- Client galleries: only authenticated (admin) can read full records
create policy "Authenticated users manage client galleries"
  on client_galleries for all
  using (auth.uid() is not null);

-- Client photos: authenticated only (access controlled at API level for clients)
create policy "Authenticated users manage client photos"
  on client_photos for all
  using (auth.uid() is not null);

-- Allow service role to bypass RLS (already the case by default for service role)

-- ─── AUTO-UPDATE updated_at ────────────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger portfolios_updated_at
  before update on portfolios
  for each row execute procedure update_updated_at();

create trigger client_galleries_updated_at
  before update on client_galleries
  for each row execute procedure update_updated_at();

-- ─── AUTO-UPDATE total_photos count ───────────────────────────────────────────
create or replace function update_client_gallery_photo_count()
returns trigger language plpgsql as $$
begin
  update client_galleries
  set total_photos = (
    select count(*) from client_photos where gallery_id = coalesce(new.gallery_id, old.gallery_id)
  )
  where id = coalesce(new.gallery_id, old.gallery_id);
  return null;
end;
$$;

create trigger client_photos_count
  after insert or delete on client_photos
  for each row execute procedure update_client_gallery_photo_count();
