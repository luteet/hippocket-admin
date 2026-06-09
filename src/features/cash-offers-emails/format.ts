export { formatDateTime } from '@/lib/format'

/** Label for a group scope; null = all properties. */
export function groupScopeLabel(groupName: string | null): string {
	return groupName ?? 'All properties'
}
