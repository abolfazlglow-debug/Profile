-- AXVORQ launch migration. Execute in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 email text,
 display_name text,
 role text not null default 'member' check (role in ('member','expert','admin','super_admin')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create or replace function public.axvorq_handle_new_user()
returns trigger language plpgsql security definer set search_path=public as $$
begin
 insert into public.profiles(id,email,display_name,role)
 values(new.id,new.email,coalesce(new.raw_user_meta_data->>'name',''),'member')
 on conflict(id) do update set email=excluded.email;
 return new;
end; $$;
drop trigger if exists axvorq_auth_user_created on auth.users;
create trigger axvorq_auth_user_created after insert on auth.users
for each row execute procedure public.axvorq_handle_new_user();

create table if not exists public.axvorq_applications (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 name text not null,email text not null,role text not null,portfolio text,intro text not null,
 status text not null default 'pending' check(status in('pending','approved','rejected')),
 created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create table if not exists public.axvorq_projects (
 id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id) on delete cascade,
 contact_name text not null,contact_email text not null,category text not null,budget text,brief text not null,
 status text not null default 'pending' check(status in('pending','approved','rejected','completed')),
 created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create table if not exists public.axvorq_experts (
 id uuid primary key default gen_random_uuid(), profile_id uuid unique references public.profiles(id) on delete set null,
 name_fa text not null,role_fa text not null,skills text[] not null default '{}',bio_fa text not null default '',
 portfolio_url text,avatar_url text,permissions jsonb not null default '{}'::jsonb,
 status text not null default 'draft' check(status in('draft','published','archived')),
 created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create table if not exists public.axvorq_articles (
 id uuid primary key default gen_random_uuid(),slug text not null unique,title_fa text not null,
 excerpt_fa text not null default '',body_fa text not null default '',category text not null default 'general',
 cover_image_url text,published_at timestamptz,status text not null default 'draft' check(status in('draft','published','archived')),
 created_by uuid references public.profiles(id) on delete set null,
 created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);

create or replace function public.axvorq_is_admin()
returns boolean language sql stable security definer set search_path=public as $$
 select exists(select 1 from public.profiles where id=auth.uid() and role in('admin','super_admin'));
$$;
create or replace function public.axvorq_admin_set_role(target_user_id uuid,new_role text)
returns boolean language plpgsql security definer set search_path=public as $$
declare actor_role text; super_count int;
begin
 select role into actor_role from public.profiles where id=auth.uid();
 if actor_role is null or actor_role not in ('admin','super_admin') then raise exception 'NOT_AUTHORIZED'; end if;
 if target_user_id=auth.uid() then raise exception 'CANNOT_CHANGE_SELF'; end if;
 if new_role not in ('member','expert','admin') then raise exception 'INVALID_ROLE'; end if;
 if actor_role='admin' and new_role='admin' then raise exception 'ROLE_REQUIRES_SUPER_ADMIN'; end if;
 if actor_role='admin' and (select role from public.profiles where id=target_user_id) in ('admin','super_admin') then raise exception 'CANNOT_CHANGE_ADMIN'; end if;
 if actor_role='super_admin' and new_role='admin' then null; end if;
 update public.profiles set role=new_role,updated_at=now() where id=target_user_id;
 if not found then raise exception 'USER_NOT_FOUND'; end if;
 return true;
end; $$;

create or replace function public.axvorq_promote_expert_on_approval()
returns trigger language plpgsql security definer set search_path=public as $$
begin
 if new.status='approved' and old.status is distinct from 'approved' then
  update public.profiles set role='expert',updated_at=now() where id=new.user_id and role='member';
 end if;
 return new;
end; $$;
drop trigger if exists axvorq_application_approved on public.axvorq_applications;
create trigger axvorq_application_approved after update of status on public.axvorq_applications
for each row execute procedure public.axvorq_promote_expert_on_approval();

alter table public.profiles enable row level security;
alter table public.axvorq_applications enable row level security;
alter table public.axvorq_projects enable row level security;
alter table public.axvorq_experts enable row level security;
alter table public.axvorq_articles enable row level security;

drop policy if exists "profile read own or admin" on public.profiles;
create policy "profile read own or admin" on public.profiles for select to authenticated using(id=auth.uid() or public.axvorq_is_admin());
drop policy if exists "applications insert own" on public.axvorq_applications;
create policy "applications insert own" on public.axvorq_applications for insert to authenticated with check(user_id=auth.uid());
drop policy if exists "applications read own or admin" on public.axvorq_applications;
create policy "applications read own or admin" on public.axvorq_applications for select to authenticated using(user_id=auth.uid() or public.axvorq_is_admin());
drop policy if exists "applications admin update" on public.axvorq_applications;
create policy "applications admin update" on public.axvorq_applications for update to authenticated using(public.axvorq_is_admin()) with check(public.axvorq_is_admin());
drop policy if exists "applications admin delete" on public.axvorq_applications;
create policy "applications admin delete" on public.axvorq_applications for delete to authenticated using(public.axvorq_is_admin());
drop policy if exists "projects insert own" on public.axvorq_projects;
create policy "projects insert own" on public.axvorq_projects for insert to authenticated with check(owner_id=auth.uid());
drop policy if exists "projects read own or admin" on public.axvorq_projects;
create policy "projects read own or admin" on public.axvorq_projects for select to authenticated using(owner_id=auth.uid() or public.axvorq_is_admin());
drop policy if exists "projects admin update" on public.axvorq_projects;
create policy "projects admin update" on public.axvorq_projects for update to authenticated using(public.axvorq_is_admin()) with check(public.axvorq_is_admin());
drop policy if exists "projects admin delete" on public.axvorq_projects;
create policy "projects admin delete" on public.axvorq_projects for delete to authenticated using(public.axvorq_is_admin());

drop policy if exists "experts published read" on public.axvorq_experts;
create policy "experts published read" on public.axvorq_experts for select to anon,authenticated using(status='published' or public.axvorq_is_admin());
drop policy if exists "experts admin insert" on public.axvorq_experts;
create policy "experts admin insert" on public.axvorq_experts for insert to authenticated with check(public.axvorq_is_admin());
drop policy if exists "experts admin update" on public.axvorq_experts;
create policy "experts admin update" on public.axvorq_experts for update to authenticated using(public.axvorq_is_admin()) with check(public.axvorq_is_admin());
drop policy if exists "experts admin delete" on public.axvorq_experts;
create policy "experts admin delete" on public.axvorq_experts for delete to authenticated using(public.axvorq_is_admin());

drop policy if exists "articles published read" on public.axvorq_articles;
create policy "articles published read" on public.axvorq_articles for select to anon,authenticated using(status='published' or public.axvorq_is_admin());
drop policy if exists "articles admin insert" on public.axvorq_articles;
create policy "articles admin insert" on public.axvorq_articles for insert to authenticated with check(public.axvorq_is_admin());
drop policy if exists "articles admin update" on public.axvorq_articles;
create policy "articles admin update" on public.axvorq_articles for update to authenticated using(public.axvorq_is_admin()) with check(public.axvorq_is_admin());
drop policy if exists "articles admin delete" on public.axvorq_articles;
create policy "articles admin delete" on public.axvorq_articles for delete to authenticated using(public.axvorq_is_admin());

grant select on public.profiles to authenticated;
grant select,insert,update,delete on public.axvorq_applications to authenticated;
grant select,insert,update,delete on public.axvorq_projects to authenticated;
grant select on public.axvorq_experts to anon,authenticated;
grant insert,update,delete on public.axvorq_experts to authenticated;
grant select on public.axvorq_articles to anon,authenticated;
grant insert,update,delete on public.axvorq_articles to authenticated;
revoke all on function public.axvorq_admin_set_role(uuid,text) from public, anon;
grant execute on function public.axvorq_admin_set_role(uuid,text) to authenticated;
insert into public.profiles(id,email,role) select id,email,'member' from auth.users on conflict(id) do nothing;
-- After the owner account exists, assign the first super-admin using the SQL editor:
-- update public.profiles set role='super_admin' where email='OWNER_EMAIL';
