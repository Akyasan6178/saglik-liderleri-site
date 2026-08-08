// API Base URL config
// Cloudflare Pages veya canlı üretim ortamında VITE_API_URL kullanılır.
// Yerel geliştirme ortamında (import.meta.env.DEV) varsayılan olarak http://localhost:8000 kullanılır.
const defaultApiUrl = import.meta.env.DEV ? 'http://localhost:8000' : ''

export const API_BASE_URL = (import.meta.env.VITE_API_URL || defaultApiUrl).replace(/\/$/, '')

if (!import.meta.env.VITE_API_URL && !import.meta.env.DEV) {
  console.warn('[API Config Warning] Canlı ortamda VITE_API_URL tanımlı değil.')
}
