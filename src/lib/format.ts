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
