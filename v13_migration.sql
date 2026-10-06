-- Boreviax Ledger V13 upgrade for an existing V12 database.
-- Adds corporate/private internal transfers and repairs incomplete sync policies.
-- Safe to run more than once.

begin;

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

alter table public.account_transfers enable row level security;
alter table public.profiles enable row level security;
alter table public.purchases enable row level security;
alter table public.purchase_items enable row level security;
alter table public.receipts enable row level security;
alter table public.investments enable row level security;
alter table public.expenses enable row level security;
alter table public.app_settings enable row level security;

-- Keep browser privileges explicit. Signed-out visitors get no ledger access.
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

-- Recreate the complete shared-company-ledger policy set. All signed-in staff may
-- read the company ledger; Finance/Admin may write; only Admin changes settings.
drop policy if exists purchases_read on public.purchases;
create policy purchases_read on public.purchases for select to authenticated using (true);
drop policy if exists purchases_insert on public.purchases;
create policy purchases_insert on public.purchases for insert to authenticated
with check (public.can_write_finance());
drop policy if exists purchases_update on public.purchases;
create policy purchases_update on public.purchases for update to authenticated
using (public.can_write_finance()) with check (public.can_write_finance());
drop policy if exists purchases_delete on public.purchases;
create policy purchases_delete on public.purchases for delete to authenticated
using (public.can_write_finance());

drop policy if exists items_read on public.purchase_items;
create policy items_read on public.purchase_items for select to authenticated using (true);
drop policy if exists items_insert on public.purchase_items;
create policy items_insert on public.purchase_items for insert to authenticated
with check (public.can_write_finance());
drop policy if exists items_update on public.purchase_items;
create policy items_update on public.purchase_items for update to authenticated
using (public.can_write_finance()) with check (public.can_write_finance());
drop policy if exists items_delete on public.purchase_items;
create policy items_delete on public.purchase_items for delete to authenticated
using (public.can_write_finance());

drop policy if exists receipts_read on public.receipts;
create policy receipts_read on public.receipts for select to authenticated using (true);
drop policy if exists receipts_insert on public.receipts;
create policy receipts_insert on public.receipts for insert to authenticated
with check (public.can_write_finance());
drop policy if exists receipts_update on public.receipts;
create policy receipts_update on public.receipts for update to authenticated
using (public.can_write_finance()) with check (public.can_write_finance());
drop policy if exists receipts_delete on public.receipts;
create policy receipts_delete on public.receipts for delete to authenticated
using (public.can_write_finance());

drop policy if exists investments_read on public.investments;
create policy investments_read on public.investments for select to authenticated using (true);
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

drop policy if exists expenses_read on public.expenses;
create policy expenses_read on public.expenses for select to authenticated using (true);
drop policy if exists expenses_insert on public.expenses;
create policy expenses_insert on public.expenses for insert to authenticated
with check (public.can_write_finance());
drop policy if exists expenses_update on public.expenses;
create policy expenses_update on public.expenses for update to authenticated
using (public.can_write_finance()) with check (public.can_write_finance());
drop policy if exists expenses_delete on public.expenses;
create policy expenses_delete on public.expenses for delete to authenticated
using (public.can_write_finance());

drop policy if exists settings_read on public.app_settings;
create policy settings_read on public.app_settings for select to authenticated using (true);
drop policy if exists settings_admin_write on public.app_settings;
drop policy if exists settings_admin_insert on public.app_settings;
create policy settings_admin_insert on public.app_settings for insert to authenticated
with check (public.is_app_admin());
drop policy if exists settings_admin_update on public.app_settings;
create policy settings_admin_update on public.app_settings for update to authenticated
using (public.is_app_admin()) with check (public.is_app_admin());

create index if not exists account_transfers_date_idx on public.account_transfers(date);
create index if not exists account_transfers_created_by_idx on public.account_transfers(created_by);
create index if not exists account_transfers_from_account_idx on public.account_transfers(from_account);
create index if not exists account_transfers_to_account_idx on public.account_transfers(to_account);

do $$
declare ledger_table text;
begin
  foreach ledger_table in array array[
    'purchases','purchase_items','receipts','investments',
    'account_transfers','expenses','app_settings'
  ]
  loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname='supabase_realtime' and schemaname='public' and tablename=ledger_table
    ) then
      execute format('alter publication supabase_realtime add table public.%I',ledger_table);
    end if;
  end loop;
end $$;

commit;
