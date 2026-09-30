import { PostgrestClient } from '@supabase/postgrest-js';
import { REQUEST_TIMEOUT_MS } from '../config';

// The app only ever reads from Supabase's REST API, so it uses the official
// query builder (@supabase/postgrest-js) on its own instead of the full
// supabase-js bundle (auth, realtime, storage) - same `.from().select()` API,
// a fraction of the JavaScript.

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

const fetchWithTimeout: typeof fetch = (input, init) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  return fetch(input, { ...init, signal: controller.signal }).finally(() => clearTimeout(timer));
};

export const db = new PostgrestClient(`${url ?? ''}/rest/v1`, {
  headers: {
    apikey: anonKey ?? '',
    Authorization: `Bearer ${anonKey ?? ''}`,
  },
  fetch: fetchWithTimeout,
});
