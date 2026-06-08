export { formatDateTime } from '@/lib/format'

/** Saved filters often have an empty title — fall back to a placeholder. */
export function savedFilterTitle(title: string): string {
	return title.trim() || 'Untitled filter'
}
