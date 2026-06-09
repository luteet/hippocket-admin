import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type {
	CreateCashOffersEmailDto,
	UpdateCashOffersEmailDto,
} from '@/types/api'
import {
	createCashOffersEmail,
	deleteCashOffersEmail,
	getCashOffersEmail,
	listCashOffersEmails,
	listGroupRefs,
	updateCashOffersEmail,
	type CashOffersEmailFilters,
} from './api'

const KEY = 'cash-offers-emails'

export function useCashOffersEmails(filters: CashOffersEmailFilters) {
	return useQuery({
		queryKey: [KEY, filters],
		queryFn: () => listCashOffersEmails(filters),
	})
}

export function useCashOffersEmail(id: string | undefined) {
	return useQuery({
		queryKey: [KEY, 'detail', id],
		queryFn: () => getCashOffersEmail(id as string),
		enabled: !!id,
	})
}

export function useCreateCashOffersEmail() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (dto: CreateCashOffersEmailDto) =>
			createCashOffersEmail(dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

export function useUpdateCashOffersEmail() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({
			id,
			dto,
		}: {
			id: string
			dto: UpdateCashOffersEmailDto
		}) => updateCashOffersEmail(id, dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

export function useDeleteCashOffersEmail() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => deleteCashOffersEmail(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

export function useGroupOptions() {
	return useQuery({
		queryKey: ['refs', 'groups'],
		queryFn: listGroupRefs,
		staleTime: 5 * 60_000,
	})
}
