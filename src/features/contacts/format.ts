export { formatDateTime } from '@/lib/format'

/** "First Last" — empty string when no name is set. */
export function fullName(first: string, last: string) {
	return `${first} ${last}`.trim()
}
