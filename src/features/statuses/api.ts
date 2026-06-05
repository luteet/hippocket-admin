import { api } from '@/lib/api/client'
import type { StatusData } from '@/types/api'

export interface StatusFilters {
	offset: number
	count: number
	search?: string
}

export async function listStatuses(
	filters: StatusFilters,
): Promise<StatusData> {
	const params: Record<string, string | number> = {
		offset: filters.offset,
		count: filters.count,
	}
	if (filters.search) params.search = filters.search

	const { data } = await api.get<StatusData>('/statuses/', { params })
	return data
}
