import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { CreateWithdrawalDto, UpdateWithdrawalDto } from '@/types/api'
import {
	createWithdrawal,
	deleteWithdrawal,
	getWithdrawal,
	listAgentRefs,
	listWithdrawals,
	updateWithdrawal,
	type WithdrawalFilters,
} from './api'

const KEY = 'withdrawals'

export function useWithdrawals(filters: WithdrawalFilters) {
	return useQuery({
		queryKey: [KEY, filters],
		queryFn: () => listWithdrawals(filters),
	})
}

export function useWithdrawal(id: string | undefined) {
	return useQuery({
		queryKey: [KEY, 'detail', id],
		queryFn: () => getWithdrawal(id as string),
		enabled: !!id,
	})
}

export function useCreateWithdrawal() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (dto: CreateWithdrawalDto) => createWithdrawal(dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

export function useUpdateWithdrawal() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdateWithdrawalDto }) =>
			updateWithdrawal(id, dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

export function useDeleteWithdrawal() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => deleteWithdrawal(id),
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
