# Marketing by WhatsApp — Satu Restoe (Web)

Static web version using the existing Supabase project `xgidnneeovsqfysleeua`.

- Source data: `public.marketing_contacts` (744 contacts)
- Cloud status/history: `public.marketing_contact_status`
- Browser uses Supabase publishable key only.
- Status writes require Supabase Auth.
- Deploy this `web/` directory as a static site (Cloudflare Pages is suitable).
- The Android APK source is untouched.

Important: the old APK's local status/history is not automatically available to the web app. The web app is prepared for a future CSV/import migration once the old local data can be exported safely.
