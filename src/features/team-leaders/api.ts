import { api } from '@/lib/api/client'
import type {
	CreateTeamLeaderDto,
	SortParams,
	TeamLeader,
	TeamLeaderData,
	UpdateTeamLeaderDto,
} from '@/types/api'

export interface TeamLeaderFilters extends SortParams {
	offset: number
	count: number
	search?: string
	group_id?: number
	office_location?: string
}

export async function listTeamLeaders(
	filters: TeamLeaderFilters,
): Promise<TeamLeaderData> {
	const params: Record<string, string | number> = {
		offset: filters.offset,
		count: filters.count,
	}
	if (filters.search) params.search = filters.search
	if (filters.group_id !== undefined) params.group_id = filters.group_id
	if (filters.office_location)
		params.office_location = filters.office_location
	if (filters.sort_by) params.sort_by = filters.sort_by
	if (filters.order) params.order = filters.order

	const { data } = await api.get<TeamLeaderData>('/team-leaders/', { params })
	return data
}

export async function getTeamLeader(id: string): Promise<TeamLeader> {
	const { data } = await api.get<TeamLeader>(`/team-leaders/${id}/`)
	return data
}

export async function createTeamLeader(
	dto: CreateTeamLeaderDto,
): Promise<TeamLeader> {
	const { data } = await api.post<TeamLeader>('/team-leaders/', dto)
	return data
}

export async function updateTeamLeader(
	id: string,
	dto: UpdateTeamLeaderDto,
): Promise<TeamLeader> {
	const { data } = await api.put<TeamLeader>(`/team-leaders/${id}/`, dto)
	return data
}

export async function deleteTeamLeader(id: string): Promise<void> {
	await api.delete(`/team-leaders/${id}/`)
}
