import { API_BASE_URL } from './api/client'

/**
 * Resolve a possibly-relative media path from the API into an absolute URL.
 * The backend returns media `*_url` fields as root-relative paths (e.g.
 * `/media/avatars/x.png`), served from the API origin (not under `/admin-api`).
 * Absolute URLs (http/https) and data/blob URIs are returned unchanged.
 */
export function resolveMediaUrl(url: string | null | undefined): string | null {
	if (!url) return null
	if (/^(https?:|data:|blob:)/i.test(url)) return url
	return `${API_BASE_URL}/${url.replace(/^\/+/, '')}`
}
