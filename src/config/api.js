// API Base URL config
// Cloudflare Pages ortamında VITE_API_URL kullanılır, yerelde http://localhost:8000'e düşer.
export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');
