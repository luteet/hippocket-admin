import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { CreateStatusDto, StatusData, UpdateStatusDto } from '@/types/api'
import {
	createStatus,
	deleteStatus,
	getStatus,
	listStatuses,
	reorderStatuses,
	updateStatus,
	type StatusFilters,
} from './api'

const KEY = 'statuses'

export function useStatuses(filters: StatusFilters) {
	return useQuery({
		queryKey: [KEY, filters],
		queryFn: () => listStatuses(filters),
	})
}

export function useStatus(id: number | undefined) {
	return useQuery({
		queryKey: [KEY, 'detail', id],
		queryFn: () => getStatus(id as number),
		enabled: id !== undefined,
	})
}

export function useCreateStatus() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (dto: CreateStatusDto) => createStatus(dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

export function useUpdateStatus() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id, dto }: { id: number; dto: UpdateStatusDto }) =>
			updateStatus(id, dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

export function useDeleteStatus() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: number) => deleteStatus(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

/**
 * Persist a drag-and-drop reorder of the pipeline statuses (renumbers
 * `priority` to `1..N` and returns the reordered list). Optimistically reorders
 * every cached list page and reassigns `priority` to match, then writes the
 * server's authoritative result straight into the cache on success. We
 * deliberately do NOT invalidate: a refetch would briefly empty the table and
 * flip it into its loading skeleton right after the drop. A failed request
 * rolls back.
 */
export function useReorderStatuses() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (ids: number[]) => reorderStatuses(ids),
		onMutate: async (ids: number[]) => {
			const snapshots = qc.getQueriesData<StatusData>({ queryKey: [KEY] })
			// Apply the optimistic order synchronously (before any await) so the
			// rows settle into place in the same frame the drag ends — otherwise
			// the dropped row briefly snaps back to its origin.
			const rank = new Map(ids.map((id, i) => [id, i]))
			for (const [key, data] of snapshots) {
				// Skip the detail caches (single record, no `items`).
				if (!data?.items) continue
				const items = [...data.items]
					.sort(
						(a, b) =>
							(rank.get(a.id) ?? Infinity) -
							(rank.get(b.id) ?? Infinity),
					)
					.map((item, i) => ({ ...item, priority: i + 1 }))
				qc.setQueryData(key, { ...data, items })
			}
			// Then stop any in-flight GET from clobbering the optimistic data.
			await qc.cancelQueries({ queryKey: [KEY] })
			return { snapshots }
		},
		onError: (_err, _ids, ctx) => {
			ctx?.snapshots.forEach(([key, data]) => qc.setQueryData(key, data))
		},
		onSuccess: (items) => {
			// Reconcile every cached list page with the server's order without
			// triggering a refetch (which would flash the loading skeleton).
			const lists = qc.getQueriesData<StatusData>({ queryKey: [KEY] })
			for (const [key, data] of lists) {
				if (!data?.items) continue
				qc.setQueryData(key, { ...data, items })
			}
		},
	})
}
