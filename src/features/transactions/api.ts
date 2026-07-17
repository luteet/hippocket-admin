import { api } from '@/lib/api/client'
import type {
	CreateReferralDto,
	CreateTransactionDto,
	Transaction,
	TransactionData,
	TransactionFilters,
	UpdateMilestoneDto,
	UpdateTransactionReferralDto,
	UpdateTransactionDto,
} from '@/types/api'

export async function listTransactions(
	filters: TransactionFilters,
): Promise<TransactionData> {
	const params: Record<string, string | number> = {
		offset: filters.offset,
		count: filters.count,
	}
	if (filters.search) params.search = filters.search
	if (filters.status) params.status = filters.status
	if (filters.role) params.role = filters.role
	if (filters.agent_id) params.agent_id = filters.agent_id
	if (filters.partner_id) params.partner_id = filters.partner_id
	if (filters.created_from) params.created_from = filters.created_from
	if (filters.created_to) params.created_to = filters.created_to
	if (filters.sort_by) params.sort_by = filters.sort_by
	if (filters.order) params.order = filters.order

	const { data } = await api.get<TransactionData>('/transactions/', {
		params,
	})
	return data
}

export async function getTransaction(id: string): Promise<Transaction> {
	const { data } = await api.get<Transaction>(`/transactions/${id}/`)
	return data
}

export async function createTransaction(
	dto: CreateTransactionDto,
): Promise<Transaction> {
	const { data } = await api.post<Transaction>('/transactions/', dto)
	return data
}

export async function updateTransaction(
	id: string,
	dto: UpdateTransactionDto,
): Promise<Transaction> {
	const { data } = await api.put<Transaction>(`/transactions/${id}/`, dto)
	return data
}

export async function deleteTransaction(id: string): Promise<void> {
	await api.delete(`/transactions/${id}/`)
}

// --- Timeline sub-resources ---

export async function createTransactionReferral(
	transactionId: string,
	dto: CreateReferralDto,
): Promise<Transaction> {
	const { data } = await api.post<Transaction>(
		`/transactions/${transactionId}/referrals/`,
		dto,
	)
	return data
}

export async function updateMilestone(
	milestoneId: string,
	dto: UpdateMilestoneDto,
): Promise<void> {
	await api.put(`/transactions/milestone/${milestoneId}/`, dto)
}

export async function updateReferral(
	referralId: string,
	dto: UpdateTransactionReferralDto,
): Promise<void> {
	await api.put(`/transactions/referral/${referralId}/`, dto)
}

export async function deleteReferral(referralId: string): Promise<void> {
	await api.delete(`/transactions/referral/${referralId}/`)
}
