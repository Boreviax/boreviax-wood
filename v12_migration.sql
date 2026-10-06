-- Boreviax Ledger V12 upgrade for an existing V5-V11 database.
-- Safe to run more than once. Existing rows become corporate-account records.

begin;

alter table public.purchases
  add column if not exists account_type text not null default 'corporate'
    check (account_type in ('corporate','private')),
  add column if not exists fee numeric(16,2) not null default 0
    check (fee >= 0),
  add column if not exists fee_date date;

alter table public.receipts
  add column if not exists account_type text not null default 'corporate'
    check (account_type in ('corporate','private')),
  add column if not exists pending_amount numeric(16,2) not null default 0
    check (pending_amount >= 0);

alter table public.expenses
  add column if not exists payment_source text not null default 'corporate'
    check (payment_source in ('corporate','private'));

alter table public.app_settings
  add column if not exists private_initial_balance numeric(16,2) not null default 0;

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

alter table public.investments enable row level security;

drop policy if exists investments_read on public.investments;
create policy investments_read on public.investments
for select to authenticated using (true);

drop policy if exists investments_insert on public.investments;
create policy investments_insert on public.investments
for insert to authenticated
with check (public.can_write_finance() and created_by = (select auth.uid()));

drop policy if exists investments_update on public.investments;
create policy investments_update on public.investments
for update to authenticated
using (public.can_write_finance())
with check (public.can_write_finance());

drop policy if exists investments_delete on public.investments;
create policy investments_delete on public.investments
for delete to authenticated
using (public.can_write_finance());

-- Explicit access is required when automatic Data API exposure is disabled.
grant select, insert, update, delete on table public.investments to authenticated;

create index if not exists purchases_account_type_idx on public.purchases(account_type);
create index if not exists receipts_account_type_idx on public.receipts(account_type);
create index if not exists investments_date_idx on public.investments(date);
create index if not exists investments_investor_idx on public.investments(investor);
create index if not exists investments_created_by_idx on public.investments(created_by);
create index if not exists investments_currency_idx on public.investments(currency);
create index if not exists investments_account_type_idx on public.investments(account_type);
create index if not exists expenses_payment_source_idx on public.expenses(payment_source);

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname='supabase_realtime' and schemaname='public' and tablename='investments'
  ) then
    execute 'alter publication supabase_realtime add table public.investments';
  end if;
end $$;

commit;

-- The legacy purchases.tax and purchases.tax_date columns are intentionally
-- retained for compatibility with older installed app versions. V12 does not
-- display, write, export or calculate them.
