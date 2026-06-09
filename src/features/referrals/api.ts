import { api } from '@/lib/api/client'
import type {
	GroupOption,
	RefOption,
	ReferralDetail,
	ReferralListData,
	SortParams,
	StatusData,
	UpdateReferralDto,
} from '@/types/api'

export interface ReferralFilters extends SortParams {
	offset: number
	count: number
	search?: string
	status_label?: string
	partner_id?: string
	agent_id?: string
	is_paid?: boolean
}

export async function listReferrals(
	filters: ReferralFilters,
): Promise<ReferralListData> {
	const params: Record<string, string | number> = {
		offset: filters.offset,
		count: filters.count,
	}
	if (filters.search) params.search = filters.search
	if (filters.status_label) params.status_label = filters.status_label
	if (filters.partner_id) params.partner_id = filters.partner_id
	if (filters.agent_id) params.agent_id = filters.agent_id
	if (filters.is_paid !== undefined) params.is_paid = String(filters.is_paid)
	if (filters.sort_by) params.sort_by = filters.sort_by
	if (filters.order) params.order = filters.order

	const { data } = await api.get<ReferralListData>('/referrals/', {
		params,
	})
	return data
}

export async function getReferral(id: string): Promise<ReferralDetail> {
	const { data } = await api.get<ReferralDetail>(`/referrals/${id}/`)
	return data
}

export async function updateReferral(
	id: string,
	dto: UpdateReferralDto,
): Promise<ReferralDetail> {
	const { data } = await api.put<ReferralDetail>(`/referrals/${id}/`, dto)
	return data
}

export async function deleteReferral(id: string): Promise<void> {
	await api.delete(`/referrals/${id}/`)
}

export async function updateReferralStatus(
	id: string,
	newStatus: string,
): Promise<{ id: string; status: string }> {
	const { data } = await api.put<{ id: string; status: string }>(
		`/referrals/${id}/status/`,
		{ new_status: newStatus },
	)
	return data
}

export async function markReferralPaid(
	id: string,
): Promise<{ id: string; is_paid: boolean }> {
	const { data } = await api.post<{ id: string; is_paid: boolean }>(
		`/referrals/${id}/mark-paid/`,
	)
	return data
}

export async function listStatuses(): Promise<StatusData> {
	const { data } = await api.get<StatusData>('/statuses/')
	return data
}

export async function listPartnerRefs(): Promise<RefOption[]> {
	const { data } = await api.get<RefOption[]>('/refs/partners/', {
		params: { limit: 500 },
	})
	return data
}

export async function listGroupRefs(): Promise<GroupOption[]> {
	const { data } = await api.get<GroupOption[]>('/refs/groups/')
	return data
}
