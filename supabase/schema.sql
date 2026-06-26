create table places (
  id uuid primary key default gen_random_uuid(),
  district text not null,
  name text not null,
  lat double precision not null,
  lng double precision not null,
  category text not null,
  description text default '',
  image_url text,
  avg_price numeric,
  google_place_id text,
  opening_hours jsonb,
  business_status text not null default 'OPERATIONAL',
  hours_last_synced timestamptz
);
create table temples (id uuid primary key default gen_random_uuid(), place_id uuid references places(id), history text, famous_monk text, merit_info text);
create table trips (id uuid primary key default gen_random_uuid(), user_id uuid, title text, days int, status text default 'draft', route jsonb);
create table items_3d (id uuid primary key default gen_random_uuid(), name text, type text, model_url text, place_id uuid references places(id), is_consumable boolean default false);
create table checkins (id uuid primary key default gen_random_uuid(), user_id uuid, place_id uuid references places(id), item_id uuid references items_3d(id), created_at timestamptz default now());
create table user_items (id uuid primary key default gen_random_uuid(), user_id uuid, item_id uuid references items_3d(id), used boolean default false);

alter table places enable row level security;
alter table items_3d enable row level security;
create policy "places readable" on places for select using (true);
create policy "items readable" on items_3d for select using (true);
