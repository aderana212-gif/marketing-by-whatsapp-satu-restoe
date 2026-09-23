# Marketing by WhatsApp — Satu Restoe (Web)

Web app for managing Satu Restoe marketing contacts and WhatsApp follow-up.

- Source data: `public.marketing_contacts` (744 active contacts)
- Cloud status/history: `public.marketing_contact_status`
- Browser uses the Supabase publishable key only.
- Status writes and backup import require Supabase Auth.
- Category-specific WhatsApp templates come from `public.marketing_templates`.
- Backup JSON includes customer data, status, notes, and full contact history.
- CSV export includes the current category and a History JSON column.
- CSV/JSON import matches customers by normalized WhatsApp number and writes status/history to Supabase.
- Deploy configuration is in `wrangler.toml`; static assets are served from `web/`.
- Lead list prioritizes Grade A and contacts not yet reached.
- Follow-up dashboard can filter today's and overdue follow-ups.
- Bulk WhatsApp works as a one-by-one queue to reduce browser popup blocking.
- Message preview and copy-to-clipboard are available before opening WhatsApp.
- The Android APK source is untouched.

Important: the old APK's local status/history is not automatically available to the web app. If an old backup file can be obtained safely, use the web import feature after logging in. Imported rows that match an existing WhatsApp number are written to cloud status/history; unmatched numbers are reported and skipped.