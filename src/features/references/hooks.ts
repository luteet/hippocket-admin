import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { CatalogItemDto } from '@/types/api'
import {
	createCatalogItem,
	deleteCatalogItem,
	listCatalog,
	listReferenceOptions,
	updateCatalogItem,
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
