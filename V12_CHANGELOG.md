# V12

- Removed tax fields from the purchase UI, calculations and exports.
- Added purchase handling fee and payment account fields.
- Added corporate/private account tracking for purchases and customer receipts.
- Added pending customer receivables as a non-cash tracking field.
- Added a complete investment ledger with offline CRUD, realtime updates and exports.
- Removed bank handling fee from the general-expense category selector.
- Added payment source to expenses and reimbursements.
- Added separate corporate/private opening balances and cash balances.
- Updated management statements, dashboard, statistics and the complete Excel workbook.
- Added the idempotent `v12_migration.sql` upgrade and retained legacy database fields for old-client compatibility.
