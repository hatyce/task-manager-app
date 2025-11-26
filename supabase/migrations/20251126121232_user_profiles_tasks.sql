create table public.profiles(
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  full_name text,
  email text not null,
  bio text,
  preferred_theme text not null default 'system' check (preferred_theme in ('system','light','dark')),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Profile are viewable by owner"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Profiles are insertable by owner"
  on public.profiles
  for insert
  with check (auth.uid() = id);

create policy "Profiles are updatable by owner"
  on public.profiles
  for update
  using (auth.uid() = id);

create table public.tasks(
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo','in_progress','done')),
  due_date date,
  priority text not null default 'medium' check (priority in ('low','medium','high')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tasks_user_id_idx on public.tasks (user_id);
alter table public.tasks enable row level security;

create policy "Tasks are viewable by owner"
  on public.tasks
  for select
  using (auth.uid() = user_id);

create policy "Tasks are insertable by owner"
  on public.tasks
  for insert
  with check (auth.uid() = user_id);

create policy "Tasks are updatable by owner"
  on public.tasks
  for update
  using (auth.uid() = user_id);
  
create policy "Tasks are deleteable by owner"
  on public.tasks
  for delete
  using (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger tasks_set_updated_at
   before update on public.tasks
   for each row execute function public.set_updated_at();