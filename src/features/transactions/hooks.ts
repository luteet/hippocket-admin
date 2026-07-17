import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type {
	CreateTransactionDto,
	TransactionFilters,
	UpdateTransactionDto,
} from '@/types/api'
import {
	createTransaction,
	deleteTransaction,
	getTransaction,
	listTransactions,
	updateTransaction,
} from './api'

const KEY = 'transactions'

export function useTransactions(filters: TransactionFilters) {
	return useQuery({
		queryKey: [KEY, filters],
		queryFn: () => listTransactions(filters),
	})
}

export function useTransaction(id: string | undefined) {
	return useQuery({
		queryKey: [KEY, 'detail', id],
		queryFn: () => getTransaction(id as string),
		enabled: !!id,
	})
}

export function useCreateTransaction() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (dto: CreateTransactionDto) => createTransaction(dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

export function useUpdateTransaction() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({
			id,
			dto,
		}: {
			id: string
			dto: UpdateTransactionDto
		}) => updateTransaction(id, dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

export function useDeleteTransaction() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => deleteTransaction(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}
