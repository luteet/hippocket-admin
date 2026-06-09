import { api } from '@/lib/api/client'
import type {
	CreateStatusDto,
	SortParams,
	Status,
	StatusData,
	UpdateStatusDto,
} from '@/types/api'

export interface StatusFilters extends SortParams {
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
	if (filters.sort_by) params.sort_by = filters.sort_by
	if (filters.order) params.order = filters.order

	const { data } = await api.get<StatusData>('/statuses/', { params })
	return data
}

// The API exposes no GET-by-id endpoint for statuses, and the set is small, so
// fetch the full list and pick the matching record. Returns null when absent.
export async function getStatus(id: number): Promise<Status | null> {
	const { items } = await listStatuses({ offset: 0, count: 1000 })
	return items.find((s) => s.id === id) ?? null
}

export async function createStatus(dto: CreateStatusDto): Promise<Status> {
	const { data } = await api.post<Status>('/statuses/', dto)
	return data
}

export async function updateStatus(
	id: number,
	dto: UpdateStatusDto,
): Promise<Status> {
	const { data } = await api.put<Status>(`/statuses/${id}/`, dto)
	return data
}

export async function deleteStatus(id: number): Promise<void> {
	await api.delete(`/statuses/${id}/`)
}

/**
 * Persist a manual drag-and-drop order. `PUT /statuses/reorder/` takes the full
 * list of ids in the desired order and atomically renumbers the `priority`
 * field to `1..N`, returning the reordered list. Ids omitted from the body are
 * appended at the end keeping their relative order, so always send every row.
 */
export async function reorderStatuses(ids: number[]): Promise<Status[]> {
	const { data } = await api.put<Status[]>('/statuses/reorder/', { ids })
	return data
}
