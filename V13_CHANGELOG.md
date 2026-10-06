# V13

- Added a dedicated corporate/private internal-transfer ledger with full offline CRUD, filtering, Realtime updates and Excel export.
- Internal transfers adjust the two account balances but never change total company cash, revenue, expenses, investments or profit.
- Repaired the live RLS policy set for receipt, expense, purchase-item and settings updates/deletes.
- Enabled Realtime publication for all ledger tables instead of only the investment table.
- Added a persistent synchronization details dialog with per-record errors and manual retry.
- Changed queue processing so one invalid record does not block unrelated records, while preserving ordering for the same record.
- Added session refresh before uploads and clearer online-versus-offline failure messages.
- Added the idempotent `v13_migration.sql` upgrade and bumped the PWA shell cache to V13.
