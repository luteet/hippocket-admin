const pad = (n: number) => String(n).padStart(2, '0')

// Build/parse `YYYY-MM-DD` directly (no Date round-trip) to avoid timezone drift.
export const toISO = (y: number, m: number, d: number) =>
	`${y}-${pad(m + 1)}-${pad(d)}`

export function parseISO(value?: string) {
	if (!value) return null
	const [y, m, d] = value.split('-').map(Number)
	if (!y || !m || !d) return null
	return { y, m: m - 1, d }
}
