import { api } from '@/lib/api/client'
import type {
	CashOffersEmail,
	CashOffersEmailsData,
	CreateCashOffersEmailDto,
	GroupOption,
	UpdateCashOffersEmailDto,
} from '@/types/api'

export interface CashOffersEmailFilters {
	offset: number
	count: number
	search?: string
	group_id?: number
	is_active?: boolean
}

export async function listCashOffersEmails(
	filters: CashOffersEmailFilters,
): Promise<CashOffersEmailsData> {
	const params: Record<string, string | number> = {
		offset: filters.offset,
		count: filters.count,
	}
	if (filters.search) params.search = filters.search
	if (filters.group_id != null) params.group_id = filters.group_id
	if (filters.is_active !== undefined)
		params.is_active = String(filters.is_active)

	const { data } = await api.get<CashOffersEmailsData>(
		'/cash-offers-emails/',
		{ params },
	)
	return data
}

export async function getCashOffersEmail(id: string): Promise<CashOffersEmail> {
	const { data } = await api.get<CashOffersEmail>(
		`/cash-offers-emails/${id}/`,
	)
	return data
}

export async function createCashOffersEmail(
	dto: CreateCashOffersEmailDto,
): Promise<CashOffersEmail> {
	const { data } = await api.post<CashOffersEmail>(
		'/cash-offers-emails/',
		dto,
	)
	return data
}

export async function updateCashOffersEmail(
	id: string,
	dto: UpdateCashOffersEmailDto,
): Promise<CashOffersEmail> {
	const { data } = await api.put<CashOffersEmail>(
		`/cash-offers-emails/${id}/`,
		dto,
	)
	return data
}

export async function deleteCashOffersEmail(id: string): Promise<void> {
	await api.delete(`/cash-offers-emails/${id}/`)
}

export async function listGroupRefs(): Promise<GroupOption[]> {
	const { data } = await api.get<GroupOption[]>('/refs/groups/')
	return data
}
