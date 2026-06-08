import { api } from '@/lib/api/client'
import type {
	AgentRefOption,
	CreateSavedFilterDto,
	SavedFilter,
	SavedFilterData,
	UpdateSavedFilterDto,
} from '@/types/api'

export interface SavedFilterFilters {
	offset: number
	count: number
	search?: string
	user_id?: string
}

export async function listSavedFilters(
	filters: SavedFilterFilters,
): Promise<SavedFilterData> {
	const params: Record<string, string | number> = {
		offset: filters.offset,
		count: filters.count,
	}
	if (filters.search) params.search = filters.search
	if (filters.user_id) params.user_id = filters.user_id

	const { data } = await api.get<SavedFilterData>('/saved-filters/', {
		params,
	})
	return data
}

export async function getSavedFilter(id: string): Promise<SavedFilter> {
	const { data } = await api.get<SavedFilter>(`/saved-filters/${id}/`)
	return data
}

export async function createSavedFilter(
	dto: CreateSavedFilterDto,
): Promise<SavedFilter> {
	const { data } = await api.post<SavedFilter>('/saved-filters/', dto)
	return data
}

export async function updateSavedFilter(
	id: string,
	dto: UpdateSavedFilterDto,
): Promise<SavedFilter> {
	const { data } = await api.put<SavedFilter>(`/saved-filters/${id}/`, dto)
	return data
}

export async function deleteSavedFilter(id: string): Promise<void> {
	await api.delete(`/saved-filters/${id}/`)
}

export async function listAgentRefs(): Promise<AgentRefOption[]> {
	const { data } = await api.get<AgentRefOption[]>('/refs/agents/', {
		params: { limit: 200 },
	})
	return data
}
