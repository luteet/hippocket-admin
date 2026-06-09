import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { CatalogItemDto, CatalogListData } from '@/types/api'
import {
	createCatalogItem,
	deleteCatalogItem,
	listCatalog,
	listReferenceOptions,
	reorderCatalog,
	updateCatalogItem,
	uploadCategoryIcon,
} from './api'

// Reference lists change rarely, so keep them fresh for a few minutes. The key
// is namespaced under 'refs' alongside the partner/agent pickers used elsewhere.
export function useReferenceOptions(key: string, endpoint: string) {
	return useQuery({
		queryKey: ['refs', key],
		queryFn: () => listReferenceOptions(endpoint),
		staleTime: 5 * 60_000,
	})
}

// Catalog (CRUD) hooks. Keyed under 'catalog' by the config's `queryKey`. The
// lists are short, so the detail/edit pages fetch the full list and pick the
// matching record (`useCatalogItem`) rather than relying on a per-id GET (only
// the categories catalog exposes one). Mutations invalidate both the catalog
// query and the matching `/refs/*` select so the partner form stays in sync.
export function useCatalog(
	queryKey: string,
	endpoint: string,
	params: { offset: number; count: number; search?: string },
) {
	return useQuery({
		queryKey: ['catalog', queryKey, params],
		queryFn: () => listCatalog(endpoint, params),
	})
}

export function useCatalogItem(
	queryKey: string,
	endpoint: string,
	id: string | undefined,
) {
	return useQuery({
		queryKey: ['catalog', queryKey, 'detail', id],
		queryFn: async () => {
			const { items } = await listCatalog(endpoint, {
				offset: 0,
				count: 1000,
			})
			return items.find((i) => i.id === id) ?? null
		},
		enabled: id !== undefined,
	})
}

function useInvalidateCatalog(queryKey: string, refsKey: string) {
	const qc = useQueryClient()
	return () => {
		qc.invalidateQueries({ queryKey: ['catalog', queryKey] })
		qc.invalidateQueries({ queryKey: ['refs', refsKey] })
	}
}

export function useCreateCatalogItem(
	queryKey: string,
	refsKey: string,
	endpoint: string,
) {
	const invalidate = useInvalidateCatalog(queryKey, refsKey)
	return useMutation({
		mutationFn: (dto: CatalogItemDto) => createCatalogItem(endpoint, dto),
		onSuccess: invalidate,
	})
}

export function useUpdateCatalogItem(
	queryKey: string,
	refsKey: string,
	endpoint: string,
) {
	const invalidate = useInvalidateCatalog(queryKey, refsKey)
	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: CatalogItemDto }) =>
			updateCatalogItem(endpoint, id, dto),
		onSuccess: invalidate,
	})
}

export function useDeleteCatalogItem(
	queryKey: string,
	refsKey: string,
	endpoint: string,
) {
	const invalidate = useInvalidateCatalog(queryKey, refsKey)
	return useMutation({
		mutationFn: (id: string) => deleteCatalogItem(endpoint, id),
		onSuccess: invalidate,
	})
}

/**
 * Persist a drag-and-drop reorder of a catalog. The full list is fetched whole
 * (count 1000) and the reorder endpoint renumbers `sort` to `1..N` and returns
 * the reordered list, so we optimistically reorder every cached list page (and
 * reassign `sort` to match — the list pages re-sort by `sort`, so the new order
 * sticks), then write the server's authoritative result straight into the cache
 * on success. We deliberately do NOT invalidate the catalog query: a refetch
 * would briefly empty the list and flip the table into its loading skeleton
 * right after the drop. A failed request rolls back.
 */
export function useReorderCatalog(
	queryKey: string,
	refsKey: string,
	endpoint: string,
) {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (ids: string[]) => reorderCatalog(endpoint, ids),
		onMutate: async (ids: string[]) => {
			const snapshots = qc.getQueriesData<CatalogListData>({
				queryKey: ['catalog', queryKey],
			})
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
					.map((item, i) => ({ ...item, sort: i + 1 }))
				qc.setQueryData(key, { ...data, items })
			}
			// Then stop any in-flight GET from clobbering the optimistic data.
			await qc.cancelQueries({ queryKey: ['catalog', queryKey] })
			return { snapshots }
		},
		onError: (_err, _ids, ctx) => {
			ctx?.snapshots.forEach(([key, data]) => qc.setQueryData(key, data))
		},
		onSuccess: (items) => {
			// Reconcile every cached list page with the server's order without
			// triggering a refetch (which would flash the loading skeleton).
			const lists = qc.getQueriesData<CatalogListData>({
				queryKey: ['catalog', queryKey],
			})
			for (const [key, data] of lists) {
				if (!data?.items) continue
				qc.setQueryData(key, { ...data, items })
			}
			// The partner-form selects mirror these; refresh them in the
			// background (they're off-screen, so no flash here).
			qc.invalidateQueries({ queryKey: ['refs', refsKey] })
		},
	})
}

/**
 * Upload a category's icon (categories catalog only). Invalidates the catalog
 * query and the matching `/refs/*` select so the detail card and any selects
 * refresh from the new icon.
 */
export function useUploadCategoryIcon(queryKey: string, refsKey: string) {
	const invalidate = useInvalidateCatalog(queryKey, refsKey)
	return useMutation({
		mutationFn: ({ id, file }: { id: string; file: File }) =>
			uploadCategoryIcon(id, file),
		onSuccess: invalidate,
	})
}
