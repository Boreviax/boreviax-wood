-- Boreviax Cloud Ledger V13
-- Run this entire file once in Supabase -> SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'viewer' check (role in ('admin','finance','viewer')),
  created_at timestamptz not null default now()
);

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  supplier text not null,
  order_no text,
  order_date date not null,
  currency text not null default 'RMB' check (currency in ('RMB','USD')),
  rate numeric(12,4) not null default 1 check (rate > 0),
  account_type text not null default 'corporate' check (account_type in ('corporate','private')),
  deposit numeric(16,2) not null default 0,
  deposit_date date,
  -- Kept only so older installed V5-V11 clients remain compatible.
  -- V13 does not display, write or calculate these two legacy tax fields.
  tax numeric(16,2) not null default 0,
  tax_date date,
  balance_pay numeric(16,2) not null default 0,
  balance_date date,
  fee numeric(16,2) not null default 0 check (fee >= 0),
  fee_date date,
  note text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.purchase_items (
  id uuid primary key default gen_random_uuid(),
  purchase_id uuid not null references public.purchases(id) on delete cascade,
  product_name text not null,
  spec text,
  qty numeric(18,4) not null default 0,
  unit text,
  unit_price numeric(18,4) not null default 0,
  subtotal numeric(16,2) not null check (subtotal >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.receipts (
  id uuid primary key default gen_random_uuid(),
  customer text not null,
  payment_type text not null default '其他',
  date date not null,
  account_type text not null default 'corporate' check (account_type in ('corporate','private')),
  currency text not null default 'USD' check (currency in ('RMB','USD')),
  amount numeric(16,2) not null default 0 check (amount >= 0),
  usd numeric(16,2) not null default 0,
  rate numeric(12,4) not null default 1,
  fx_fee numeric(16,2) not null default 0,
  rmb numeric(16,2) not null check (rmb >= 0),
  pending_amount numeric(16,2) not null default 0 check (pending_amount >= 0),
  qty numeric(18,4) not null default 0,
  note text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.investments (
  id uuid primary key default gen_random_uuid(),
  investor text not null,
  date date not null,
  account_type text not null default 'corporate' check (account_type in ('corporate','private')),
  currency text not null default 'RMB' check (currency in ('RMB','USD')),
  original_amount numeric(16,2) not null default 0 check (original_amount >= 0),
  rate numeric(12,4) not null default 1 check (rate > 0),
  rmb numeric(16,2) not null check (rmb >= 0),
  note text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.account_transfers (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  from_account text not null check (from_account in ('corporate','private')),
  to_account text not null check (to_account in ('corporate','private')),
  amount numeric(16,2) not null check (amount > 0),
  purpose text not null default '账户调拨',
  note text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint account_transfers_different_accounts check (from_account <> to_account)
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  category text not null,
  payment_source text not null default 'corporate' check (payment_source in ('corporate','private')),
  currency text not null default 'RMB' check (currency in ('RMB','USD')),
  original_amount numeric(16,2) not null default 0 check (original_amount >= 0),
  rate numeric(12,4) not null default 1 check (rate > 0),
  amount numeric(16,2) not null check (amount >= 0),
  party text,
  note text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_settings (
  id smallint primary key default 1 check (id = 1),
  initial_balance numeric(16,2) not null default 0,
  private_initial_balance numeric(16,2) not null default 0,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

insert into public.app_settings(id,initial_balance)
values (1,0)
on conflict (id) do nothing;

-- Automatically create a Viewer profile for every new Auth user.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles(id, display_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)), 'viewer')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Helper role functions run as SECURITY INVOKER; profiles are readable by signed-in users.
create or replace function public.current_app_role()
returns text
language sql
stable
security invoker
set search_path = public
as $$
  select coalesce((select role from public.profiles where id = (select auth.uid())), 'viewer');
$$;

create or replace function public.can_write_finance()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select public.current_app_role() in ('admin','finance');
$$;

create or replace function public.is_app_admin()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select public.current_app_role() = 'admin';
$$;

revoke all on function public.current_app_role() from public, anon;
revoke all on function public.can_write_finance() from public, anon;
revoke all on function public.is_app_admin() from public, anon;
revoke all on function public.handle_new_user() from public, anon, authenticated;
grant execute on function public.current_app_role() to authenticated;
grant execute on function public.can_write_finance() to authenticated;
grant execute on function public.is_app_admin() to authenticated;

alter table public.profiles enable row level security;
alter table public.purchases enable row level security;
alter table public.purchase_items enable row level security;
alter table public.receipts enable row level security;
alter table public.investments enable row level security;
alter table public.account_transfers enable row level security;
alter table public.expenses enable row level security;
alter table public.app_settings enable row level security;

-- Profiles: everyone signed in can read roles; only Admin can change them.
drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles for select to authenticated using (true);

drop policy if exists profiles_admin_update on public.profiles;
create policy profiles_admin_update on public.profiles for update to authenticated
using (public.is_app_admin()) with check (public.is_app_admin());

-- Ledger tables: every signed-in company user can read.
drop policy if exists purchases_read on public.purchases;
create policy purchases_read on public.purchases for select to authenticated using (true);
drop policy if exists items_read on public.purchase_items;
create policy items_read on public.purchase_items for select to authenticated using (true);
drop policy if exists receipts_read on public.receipts;
create policy receipts_read on public.receipts for select to authenticated using (true);
drop policy if exists investments_read on public.investments;
create policy investments_read on public.investments for select to authenticated using (true);
drop policy if exists expenses_read on public.expenses;
create policy expenses_read on public.expenses for select to authenticated using (true);
drop policy if exists settings_read on public.app_settings;
create policy settings_read on public.app_settings for select to authenticated using (true);

-- Finance/Admin can add, edit and delete financial records.
drop policy if exists purchases_insert on public.purchases;
create policy purchases_insert on public.purchases for insert to authenticated
with check (public.can_write_finance());
drop policy if exists purchases_update on public.purchases;
create policy purchases_update on public.purchases for update to authenticated
using (public.can_write_finance()) with check (public.can_write_finance());
drop policy if exists purchases_delete on public.purchases;
create policy purchases_delete on public.purchases for delete to authenticated
using (public.can_write_finance());

drop policy if exists items_insert on public.purchase_items;
create policy items_insert on public.purchase_items for insert to authenticated
with check (public.can_write_finance());
drop policy if exists items_update on public.purchase_items;
create policy items_update on public.purchase_items for update to authenticated
using (public.can_write_finance()) with check (public.can_write_finance());
drop policy if exists items_delete on public.purchase_items;
create policy items_delete on public.purchase_items for delete to authenticated
using (public.can_write_finance());

drop policy if exists receipts_insert on public.receipts;
create policy receipts_insert on public.receipts for insert to authenticated
with check (public.can_write_finance());
drop policy if exists receipts_update on public.receipts;
create policy receipts_update on public.receipts for update to authenticated
using (public.can_write_finance()) with check (public.can_write_finance());
drop policy if exists receipts_delete on public.receipts;
create policy receipts_delete on public.receipts for delete to authenticated
using (public.can_write_finance());

drop policy if exists investments_insert on public.investments;
create policy investments_insert on public.investments for insert to authenticated
with check (public.can_write_finance());
drop policy if exists investments_update on public.investments;
create policy investments_update on public.investments for update to authenticated
using (public.can_write_finance()) with check (public.can_write_finance());
drop policy if exists investments_delete on public.investments;
create policy investments_delete on public.investments for delete to authenticated
using (public.can_write_finance());

drop policy if exists transfers_read on public.account_transfers;
create policy transfers_read on public.account_transfers for select to authenticated using (true);
drop policy if exists transfers_insert on public.account_transfers;
create policy transfers_insert on public.account_transfers for insert to authenticated
with check (public.can_write_finance());
drop policy if exists transfers_update on public.account_transfers;
create policy transfers_update on public.account_transfers for update to authenticated
using (public.can_write_finance()) with check (public.can_write_finance());
drop policy if exists transfers_delete on public.account_transfers;
create policy transfers_delete on public.account_transfers for delete to authenticated
using (public.can_write_finance());

drop policy if exists expenses_insert on public.expenses;
create policy expenses_insert on public.expenses for insert to authenticated
with check (public.can_write_finance());
drop policy if exists expenses_update on public.expenses;
create policy expenses_update on public.expenses for update to authenticated
using (public.can_write_finance()) with check (public.can_write_finance());
drop policy if exists expenses_delete on public.expenses;
create policy expenses_delete on public.expenses for delete to authenticated
using (public.can_write_finance());

-- Only Admin can change the starting balance.
drop policy if exists settings_admin_write on public.app_settings;
drop policy if exists settings_admin_insert on public.app_settings;
create policy settings_admin_insert on public.app_settings for insert to authenticated
with check (public.is_app_admin());
drop policy if exists settings_admin_update on public.app_settings;
create policy settings_admin_update on public.app_settings for update to authenticated
using (public.is_app_admin()) with check (public.is_app_admin());


-- Supabase 2026 Data API explicit grants.
-- New projects no longer expose new public tables to the Data API automatically.
revoke all on table public.profiles from anon, authenticated;
revoke all on table public.purchases from anon, authenticated;
revoke all on table public.purchase_items from anon, authenticated;
revoke all on table public.receipts from anon, authenticated;
revoke all on table public.investments from anon, authenticated;
revoke all on table public.account_transfers from anon, authenticated;
revoke all on table public.expenses from anon, authenticated;
revoke all on table public.app_settings from anon, authenticated;

grant select, update on table public.profiles to authenticated;

grant select, insert, update, delete on table public.purchases to authenticated;
grant select, insert, update, delete on table public.purchase_items to authenticated;
grant select, insert, update, delete on table public.receipts to authenticated;
grant select, insert, update, delete on table public.investments to authenticated;
grant select, insert, update, delete on table public.account_transfers to authenticated;
grant select, insert, update, delete on table public.expenses to authenticated;

grant select, insert, update on table public.app_settings to authenticated;

-- Helpful indexes
create index if not exists purchases_order_date_idx on public.purchases(order_date);
create index if not exists purchases_supplier_idx on public.purchases(supplier);
create index if not exists purchase_items_purchase_id_idx on public.purchase_items(purchase_id);
create index if not exists receipts_date_idx on public.receipts(date);
create index if not exists receipts_customer_idx on public.receipts(customer);
create index if not exists investments_date_idx on public.investments(date);
create index if not exists investments_investor_idx on public.investments(investor);
create index if not exists expenses_date_idx on public.expenses(date);
create index if not exists purchases_created_by_idx on public.purchases(created_by);
create index if not exists receipts_created_by_idx on public.receipts(created_by);
create index if not exists investments_created_by_idx on public.investments(created_by);
create index if not exists expenses_created_by_idx on public.expenses(created_by);
create index if not exists app_settings_updated_by_idx on public.app_settings(updated_by);
create index if not exists purchases_currency_idx on public.purchases(currency);
create index if not exists receipts_currency_idx on public.receipts(currency);
create index if not exists investments_currency_idx on public.investments(currency);
create index if not exists expenses_currency_idx on public.expenses(currency);
create index if not exists purchases_account_type_idx on public.purchases(account_type);
create index if not exists receipts_account_type_idx on public.receipts(account_type);
create index if not exists investments_account_type_idx on public.investments(account_type);
create index if not exists account_transfers_date_idx on public.account_transfers(date);
create index if not exists account_transfers_created_by_idx on public.account_transfers(created_by);
create index if not exists account_transfers_from_account_idx on public.account_transfers(from_account);
create index if not exists account_transfers_to_account_idx on public.account_transfers(to_account);
create index if not exists expenses_payment_source_idx on public.expenses(payment_source);

-- Enable Postgres Changes for real-time refresh.
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='purchases') then
    execute 'alter publication supabase_realtime add table public.purchases';
  end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='purchase_items') then
    execute 'alter publication supabase_realtime add table public.purchase_items';
  end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='receipts') then
    execute 'alter publication supabase_realtime add table public.receipts';
  end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='investments') then
    execute 'alter publication supabase_realtime add table public.investments';
  end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='account_transfers') then
    execute 'alter publication supabase_realtime add table public.account_transfers';
  end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='expenses') then
    execute 'alter publication supabase_realtime add table public.expenses';
  end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='app_settings') then
    execute 'alter publication supabase_realtime add table public.app_settings';
  end if;
end $$;

-- IMPORTANT: After your first user exists, promote that account to Admin once:
-- update public.profiles
-- set role = 'admin'
-- where id = (select id from auth.users where email = 'YOUR_EMAIL@EXAMPLE.COM');
