import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { CreateStatusDto, UpdateStatusDto } from '@/types/api'
import {
	createStatus,
	deleteStatus,
	getStatus,
	listStatuses,
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
