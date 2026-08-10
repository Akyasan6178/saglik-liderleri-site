// LEGACY — UNUSED (DATA-WARN-01 cleanup, 2026-08-10)
// This file was used when the backend was a Django REST API on localhost:8000.
// All API calls now go through Supabase (supabaseClient.js) and Edge Functions.
// API_BASE_URL is no longer imported anywhere in the codebase.
// Kept as a historical reference; safe to delete in a future cleanup pass.
//
// Original content:
// const defaultApiUrl = import.meta.env.DEV ? 'http://localhost:8000' : ''
// export const API_BASE_URL = (import.meta.env.VITE_API_URL || defaultApiUrl).replace(/\/$/, '')
