import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type {
	CreatePartnerDto,
	PaginationParams,
	UpdatePartnerDto,
} from '@/types/api'
import {
	createPartner,
	deletePartner,
	getPartner,
	listPartners,
	updatePartner,
} from './api'

const KEY = 'partners'

export function usePartners(params: PaginationParams) {
	return useQuery({
		queryKey: [KEY, params],
		queryFn: () => listPartners(params),
	})
}

export function usePartner(id: string | undefined) {
	return useQuery({
		queryKey: [KEY, 'detail', id],
		queryFn: () => getPartner(id as string),
		enabled: !!id,
	})
}

export function useCreatePartner() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (dto: CreatePartnerDto) => createPartner(dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

export function useUpdatePartner() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdatePartnerDto }) =>
			updatePartner(id, dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

export function useDeletePartner() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => deletePartner(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}
