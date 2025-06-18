-- Tabla de usuarios
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  name text not null,
  department text,
  team text,
  area text,
  avatar text,
  birthday date,
  is_admin boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tabla de valores corporativos
create table if not exists values (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  color text not null,
  icon text not null,
  description text not null,
  example text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tabla de medallas/reconocimientos
create table if not exists medals (
  id uuid primary key default uuid_generate_v4(),
  giver_id uuid not null references users(id) on delete cascade,
  recipient_id uuid not null references users(id) on delete cascade,
  value_name text not null references values(name) on delete restrict,
  message text not null,
  is_public boolean default true,
  likes integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tabla de comentarios en medallas
create table if not exists medal_comments (
  id uuid primary key default uuid_generate_v4(),
  medal_id uuid not null references medals(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  message text not null,
  created_at timestamptz default now()
);

-- Tabla de likes a medallas
create table if not exists medal_likes (
  id uuid primary key default uuid_generate_v4(),
  medal_id uuid not null references medals(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  created_at timestamptz default now(),
  unique(medal_id, user_id)
);

-- Indices útiles
create index if not exists idx_medals_giver_id on medals(giver_id);
create index if not exists idx_medals_recipient_id on medals(recipient_id);
create index if not exists idx_medals_value_name on medals(value_name);
create index if not exists idx_medal_comments_medal_id on medal_comments(medal_id);
create index if not exists idx_medal_likes_medal_id on medal_likes(medal_id);