// Boreviax Ledger - Supabase frontend configuration.
// All browser traffic uses the Vercel same-origin relay at /cloud so devices
// do not need to connect to the Supabase project hostname directly.
// Publishable keys are designed for browser use. Never place a service_role / secret key here.
export const SUPABASE_URL = `${window.location.origin}/cloud`;
export const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_tehcOPO_iNrnNl9AVuS-uw_dDP9MjMj";
// Preserve the original session key so existing V14 installations stay signed in.
export const SUPABASE_AUTH_STORAGE_KEY = "sb-akfunwjocixwngnywfuk-auth-token";
