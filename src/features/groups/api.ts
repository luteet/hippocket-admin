import { api } from '@/lib/api/client'
import type { Group, GroupsData } from '@/types/api'

export interface GroupFilters {
	offset: number
	count: number
	/** Matches name or slug. */
	search?: string
	/** Filter soft-deleted groups; omit to return all. */
	is_deleted?: boolean
}

export async function listGroups(filters: GroupFilters): Promise<GroupsData> {
	const params: Record<string, string | number> = {
		offset: filters.offset,
		count: filters.count,
	}
	if (filters.search) params.search = filters.search
	if (filters.is_deleted !== undefined)
		params.is_deleted = String(filters.is_deleted)

	const { data } = await api.get<GroupsData>('/groups/', { params })
	return data
}

export async function getGroup(id: number): Promise<Group> {
	const { data } = await api.get<Group>(`/groups/${id}/`)
	return data
}
