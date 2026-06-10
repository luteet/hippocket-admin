/** Render an ISO/`YYYY-MM-DD HH:mm:ss` timestamp as a readable date-time. */
export function formatDateTime(value: string | null) {
	if (!value) return '—'
	const date = new Date(value.replace(' ', 'T'))
	if (Number.isNaN(date.getTime())) return value
	return date.toLocaleString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}

/**
 * Anything older (or newer) than this many days drops out of relative form:
 * "3 weeks ago" scans worse than an absolute "May 12, 2026".
 */
const RELATIVE_CUTOFF_DAYS = 7

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

/**
 * Render a timestamp as human-friendly relative time ("just now", "2 hours
 * ago", "yesterday"). Beyond {@link RELATIVE_CUTOFF_DAYS} days in either
 * direction it falls back to the absolute date (no time-of-day). Null/invalid
 * handling matches {@link formatDateTime} so nothing regresses to "Invalid
 * Date". "now" is computed per call, never at module load.
 */
export function formatRelativeTime(value: string | null) {
	if (!value) return '—'
	const date = new Date(value.replace(' ', 'T'))
	if (Number.isNaN(date.getTime())) return value

	const diff = date.getTime() - Date.now()
	const abs = Math.abs(diff)

	// Sub-minute past or (clock-skew) future reads cleanest as a neutral phrase.
	if (abs < MINUTE) return 'just now'
	if (abs < HOUR) return rtf.format(Math.round(diff / MINUTE), 'minute')
	if (abs < DAY) return rtf.format(Math.round(diff / HOUR), 'hour')
	if (abs < RELATIVE_CUTOFF_DAYS * DAY)
		return rtf.format(Math.round(diff / DAY), 'day')

	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	})
}
