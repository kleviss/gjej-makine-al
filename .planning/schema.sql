-- Gjej Makine AL - Full Database Schema
-- Supabase Migration

-- ============================================
-- EXTENSIONS
-- ============================================
create extension if not exists "uuid-ossp";

-- ============================================
-- HELPER: updated_at trigger function
-- ============================================
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================
-- TABLE: user_profiles
-- ============================================
create table user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  phone text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

create index idx_user_profiles_role on user_profiles(role);

-- Auto-create profile on auth.users insert
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', new.email));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================
-- TABLE: vehicles
-- ============================================
create table vehicles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  make text not null,
  model text not null,
  year int not null,
  price numeric not null,
  mileage int,
  transmission text check (transmission in ('manual', 'automatic')),
  fuel_type text check (fuel_type in ('petrol', 'diesel', 'electric', 'hybrid', 'lpg')),
  description text,
  features jsonb default '[]'::jsonb,
  images text[] default '{}',
  location text,
  status text not null default 'pending' check (status in ('active', 'pending', 'sold', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_vehicles_user_id on vehicles(user_id);
create index idx_vehicles_status on vehicles(status);
create index idx_vehicles_make_model on vehicles(make, model);
create index idx_vehicles_price on vehicles(price);

create trigger vehicles_updated_at
  before update on vehicles
  for each row execute function handle_updated_at();

-- ============================================
-- TABLE: saved_cars
-- ============================================
create table saved_cars (
  user_id uuid not null references auth.users(id) on delete cascade,
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, vehicle_id)
);

-- ============================================
-- TABLE: conversations
-- ============================================
create table conversations (
  id uuid primary key default uuid_generate_v4(),
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  buyer_id uuid not null references auth.users(id) on delete cascade,
  seller_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_conversations_buyer on conversations(buyer_id);
create index idx_conversations_seller on conversations(seller_id);
create index idx_conversations_vehicle on conversations(vehicle_id);

create trigger conversations_updated_at
  before update on conversations
  for each row execute function handle_updated_at();

-- ============================================
-- TABLE: messages
-- ============================================
create table messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_messages_conversation on messages(conversation_id);

-- ============================================
-- TABLE: reported_content
-- ============================================
create table reported_content (
  id uuid primary key default uuid_generate_v4(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  reason text not null,
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'resolved')),
  created_at timestamptz not null default now()
);

create index idx_reported_content_status on reported_content(status);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- user_profiles
alter table user_profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on user_profiles for select using (true);

create policy "Users can update own profile"
  on user_profiles for update using (auth.uid() = id);

-- vehicles
alter table vehicles enable row level security;

create policy "Active vehicles are viewable by everyone"
  on vehicles for select using (status = 'active' or user_id = auth.uid());

create policy "Authenticated users can insert vehicles"
  on vehicles for insert with check (auth.uid() = user_id);

create policy "Users can update own vehicles"
  on vehicles for update using (auth.uid() = user_id);

create policy "Users can delete own vehicles"
  on vehicles for delete using (auth.uid() = user_id);

-- saved_cars
alter table saved_cars enable row level security;

create policy "Users can view own saved cars"
  on saved_cars for select using (auth.uid() = user_id);

create policy "Users can save cars"
  on saved_cars for insert with check (auth.uid() = user_id);

create policy "Users can unsave cars"
  on saved_cars for delete using (auth.uid() = user_id);

-- conversations
alter table conversations enable row level security;

create policy "Participants can view own conversations"
  on conversations for select using (auth.uid() in (buyer_id, seller_id));

create policy "Authenticated users can start conversations"
  on conversations for insert with check (auth.uid() = buyer_id);

-- messages
alter table messages enable row level security;

create policy "Conversation participants can view messages"
  on messages for select using (
    exists (
      select 1 from conversations c
      where c.id = conversation_id
        and auth.uid() in (c.buyer_id, c.seller_id)
    )
  );

create policy "Conversation participants can send messages"
  on messages for insert with check (
    auth.uid() = sender_id
    and exists (
      select 1 from conversations c
      where c.id = conversation_id
        and auth.uid() in (c.buyer_id, c.seller_id)
    )
  );

create policy "Users can mark messages as read"
  on messages for update using (
    exists (
      select 1 from conversations c
      where c.id = conversation_id
        and auth.uid() in (c.buyer_id, c.seller_id)
    )
  );

-- reported_content
alter table reported_content enable row level security;

create policy "Users can view own reports"
  on reported_content for select using (auth.uid() = reporter_id);

create policy "Authenticated users can report content"
  on reported_content for insert with check (auth.uid() = reporter_id);

-- ============================================
-- ADMIN POLICIES (role = 'admin')
-- ============================================

create policy "Admins can view all vehicles"
  on vehicles for select using (
    exists (select 1 from user_profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update any vehicle"
  on vehicles for update using (
    exists (select 1 from user_profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can view all reports"
  on reported_content for select using (
    exists (select 1 from user_profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update reports"
  on reported_content for update using (
    exists (select 1 from user_profiles where id = auth.uid() and role = 'admin')
  );
