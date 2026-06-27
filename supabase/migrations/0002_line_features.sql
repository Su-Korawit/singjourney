-- ผู้ใช้ที่เข้าระบบด้วย LINE Login
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  line_user_id text unique not null,
  display_name text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- ผู้ดูแลสถานที่ที่ verify แล้ว (มีสิทธิ์แจ้งเปิด-ปิดผ่าน LINE OA)
create table if not exists place_reporters (
  id uuid primary key default gen_random_uuid(),
  place_id text not null references places(id),
  line_user_id text not null,
  label text not null default 'ผู้ดูแล',
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  unique (place_id, line_user_id)
);

-- override สถานะเปิด-ปิดที่ชุมชนแจ้งเข้ามา
create table if not exists place_status_overrides (
  id uuid primary key default gen_random_uuid(),
  place_id text not null references places(id),
  status text not null check (status in ('open','closed')),
  note text,
  reported_by text not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);
create index if not exists idx_overrides_place_active
  on place_status_overrides (place_id, expires_at desc);
