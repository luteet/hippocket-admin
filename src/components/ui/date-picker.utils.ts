import { MONTHS_SHORT } from '@/components/ui/date-picker.constants'

export function formatDisplay(value: string) {
	const [y, m, d] = value.split('-').map(Number)
	if (!y || !m || !d) return value
	return `${MONTHS_SHORT[m - 1]} ${d}, ${y}`
}
