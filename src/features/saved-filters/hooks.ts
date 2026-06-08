import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { CreateSavedFilterDto, UpdateSavedFilterDto } from '@/types/api'
import {
	createSavedFilter,
	deleteSavedFilter,
	getSavedFilter,
	listAgentRefs,
	listSavedFilters,
	updateSavedFilter,
	type SavedFilterFilters,
} from './api'

const KEY = 'saved-filters'

export function useSavedFilters(filters: SavedFilterFilters) {
	return useQuery({
		queryKey: [KEY, filters],
		queryFn: () => listSavedFilters(filters),
	})
}

export function useSavedFilter(id: string | undefined) {
	return useQuery({
		queryKey: [KEY, 'detail', id],
		queryFn: () => getSavedFilter(id as string),
		enabled: !!id,
	})
}

export function useCreateSavedFilter() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (dto: CreateSavedFilterDto) => createSavedFilter(dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

export function useUpdateSavedFilter() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdateSavedFilterDto }) =>
			updateSavedFilter(id, dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

export function useDeleteSavedFilter() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => deleteSavedFilter(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

export function useAgentRefOptions() {
	return useQuery({
		queryKey: ['refs', 'agents'],
		queryFn: listAgentRefs,
		staleTime: 5 * 60_000,
	})
}
