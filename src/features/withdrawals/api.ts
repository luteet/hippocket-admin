import { api } from '@/lib/api/client'
import type {
	AgentRefOption,
	CreateWithdrawalDto,
	SortParams,
	UpdateWithdrawalDto,
	Withdrawal,
	WithdrawalData,
	WithdrawalMethod,
	WithdrawalStatus,
} from '@/types/api'

export interface WithdrawalFilters extends SortParams {
	offset: number
	count: number
	search?: string
	status?: WithdrawalStatus
	method?: WithdrawalMethod
}

export async function listWithdrawals(
	filters: WithdrawalFilters,
): Promise<WithdrawalData> {
	const params: Record<string, string | number> = {
		offset: filters.offset,
		count: filters.count,
	}
	if (filters.search) params.search = filters.search
	if (filters.status) params.status = filters.status
	if (filters.method) params.method = filters.method
	if (filters.sort_by) params.sort_by = filters.sort_by
	if (filters.order) params.order = filters.order

	const { data } = await api.get<WithdrawalData>('/withdrawals/', { params })
	return data
}

export async function getWithdrawal(id: string): Promise<Withdrawal> {
	const { data } = await api.get<Withdrawal>(`/withdrawals/${id}/`)
	return data
}

export async function createWithdrawal(
	dto: CreateWithdrawalDto,
): Promise<Withdrawal> {
	const { data } = await api.post<Withdrawal>('/withdrawals/', dto)
	return data
}

export async function updateWithdrawal(
	id: string,
	dto: UpdateWithdrawalDto,
): Promise<Withdrawal> {
	const { data } = await api.put<Withdrawal>(`/withdrawals/${id}/`, dto)
	return data
}

export async function deleteWithdrawal(id: string): Promise<void> {
	await api.delete(`/withdrawals/${id}/`)
}

export async function listAgentRefs(): Promise<AgentRefOption[]> {
	const { data } = await api.get<AgentRefOption[]>('/refs/agents/', {
		params: { limit: 200 },
	})
	return data
}
