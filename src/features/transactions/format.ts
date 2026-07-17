export { formatDateTime } from '@/lib/format'

/**
 * Capitalize the first letter of a string (for role, status labels).
 */
export function capitalize(value: string): string {
	if (!value) return ''
	return value.charAt(0).toUpperCase() + value.slice(1)
}
