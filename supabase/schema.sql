-- ==============================================================================
-- Cloud Device Manager - Database Schema & Row Level Security (RLS)
-- Run this script in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. Create PROFILES table
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create CATEGORIES table
create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
  name text not null check (char_length(trim(name)) > 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create DEVICES table
create table if not exists public.devices (
  id uuid default gen_random_uuid() primary key,
  category_id uuid references public.categories(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
  name text not null check (char_length(trim(name)) > 0),
  device_id text default null,
  status text not null default 'Empty' check (status in ('Empty', 'In Progress', 'Active', 'Completed', 'Error')),
  notes text default null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Automatically update 'updated_at' on devices
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists trigger_set_devices_updated_at on public.devices;
create trigger trigger_set_devices_updated_at
  before update on public.devices
  for each row execute function public.handle_updated_at();

-- 5. Trigger to automatically create a profile when a new user signs up in Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures complete multi-tenant privacy & data isolation per user
-- ==============================================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.devices enable row level security;

-- PROFILES Policies
drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- CATEGORIES Policies
drop policy if exists "Users can view own categories" on public.categories;
create policy "Users can view own categories"
  on public.categories for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create own categories" on public.categories;
create policy "Users can create own categories"
  on public.categories for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own categories" on public.categories;
create policy "Users can update own categories"
  on public.categories for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own categories" on public.categories;
create policy "Users can delete own categories"
  on public.categories for delete
  using (auth.uid() = user_id);

-- DEVICES Policies
drop policy if exists "Users can view own devices" on public.devices;
create policy "Users can view own devices"
  on public.devices for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create own devices" on public.devices;
create policy "Users can create own devices"
  on public.devices for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.categories
      where categories.id = category_id
      and categories.user_id = auth.uid()
    )
  );

drop policy if exists "Users can update own devices" on public.devices;
create policy "Users can update own devices"
  on public.devices for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.categories
      where categories.id = category_id
      and categories.user_id = auth.uid()
    )
  );

drop policy if exists "Users can delete own devices" on public.devices;
create policy "Users can delete own devices"
  on public.devices for delete
  using (auth.uid() = user_id);

-- ==============================================================================
-- REALTIME REPLICATION CONFIGURATION
-- ==============================================================================
-- Full replica identity allows realtime change payloads to include complete row state
alter table public.categories replica identity full;
alter table public.devices replica identity full;

-- Add tables to realtime publication (wrapped in DO block to handle already-added cases)
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'categories'
  ) then
    alter publication supabase_realtime add table public.categories;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'devices'
  ) then
    alter publication supabase_realtime add table public.devices;
  end if;
end $$;

-- Indexes for performance
create index if not exists idx_categories_user_id on public.categories(user_id);
create index if not exists idx_devices_category_id on public.devices(category_id);
create index if not exists idx_devices_user_id on public.devices(user_id);
create index if not exists idx_devices_status on public.devices(status);
