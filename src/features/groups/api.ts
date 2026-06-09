import { api } from '@/lib/api/client'
import type {
	AgentOption,
	CreateGroupDto,
	Group,
	GroupsData,
	SortParams,
	UpdateGroupDto,
} from '@/types/api'

export interface GroupFilters extends SortParams {
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
	if (filters.sort_by) params.sort_by = filters.sort_by
	if (filters.order) params.order = filters.order

	const { data } = await api.get<GroupsData>('/groups/', { params })
	return data
}

export async function getGroup(id: number): Promise<Group> {
	const { data } = await api.get<Group>(`/groups/${id}/`)
	return data
}

export async function createGroup(dto: CreateGroupDto): Promise<Group> {
	const { data } = await api.post<Group>('/groups/', dto)
	return data
}

export async function updateGroup(
	id: number,
	dto: UpdateGroupDto,
): Promise<Group> {
	const { data } = await api.put<Group>(`/groups/${id}/`, dto)
	return data
}

// Soft delete by default — the group is marked `is_deleted` and can be
// restored. (A `?hard=true` permanent delete exists but is blocked when the
// group still has Team Leaders; we don't expose it here.)
export async function deleteGroup(id: number): Promise<void> {
	await api.delete(`/groups/${id}/`)
}

/**
 * Upload (replace) a group's logo. `PUT /groups/{id}/logo/` takes a
 * `multipart/form-data` body with a single `file` field and returns the updated
 * group detail (new link in `logo_url`). Let axios set the multipart
 * Content-Type (and boundary) from the FormData — don't set it manually.
 */
export async function uploadGroupLogo(id: number, file: File): Promise<Group> {
	const form = new FormData()
	form.append('file', file)
	// The axios instance defaults to `Content-Type: application/json`; clear it
	// so axios detects the FormData and sets `multipart/form-data` *with the
	// boundary*. Without this the body is mangled and the `file` field is lost.
	const { data } = await api.put<Group>(`/groups/${id}/logo/`, form, {
		headers: { 'Content-Type': undefined },
	})
	return data
}

export async function listAgentRefs(): Promise<AgentOption[]> {
	const { data } = await api.get<AgentOption[]>('/refs/agents/', {
		params: { limit: 200 },
	})
	return data
}
