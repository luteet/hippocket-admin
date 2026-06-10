import { api } from '@/lib/api/client'
import type {
	AgentRefOption,
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

// The export endpoint accepts the same filters as the list (minus pagination):
// it streams the whole filtered selection as an .xlsx file.
export interface ReferralExportFilters extends SortParams {
	search?: string
	status_label?: string
	partner_id?: string
	agent_id?: string
	is_paid?: boolean
	created_from?: string
	created_to?: string
	group_ids?: number[]
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

// Pull the suggested filename out of the Content-Disposition header
// (`pipeline_export_<YYYY-MM-DD>.xlsx`), falling back if it's absent.
function filenameFromDisposition(header: string | undefined): string {
	const match = header?.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i)
	return match ? decodeURIComponent(match[1]) : 'pipeline_export.xlsx'
}

export async function exportReferrals(
	filters: ReferralExportFilters,
): Promise<{ blob: Blob; filename: string }> {
	// Build the query by hand so `group_ids` repeats (group_ids=1&group_ids=2).
	const params = new URLSearchParams()
	if (filters.search) params.set('search', filters.search)
	if (filters.status_label) params.set('status_label', filters.status_label)
	if (filters.partner_id) params.set('partner_id', filters.partner_id)
	if (filters.agent_id) params.set('agent_id', filters.agent_id)
	if (filters.is_paid !== undefined)
		params.set('is_paid', String(filters.is_paid))
	if (filters.created_from) params.set('created_from', filters.created_from)
	if (filters.created_to) params.set('created_to', filters.created_to)
	filters.group_ids?.forEach((id) => params.append('group_ids', String(id)))
	if (filters.sort_by) params.set('sort_by', filters.sort_by)
	if (filters.order) params.set('order', filters.order)

	const response = await api.get('/referrals/export/', {
		params,
		responseType: 'blob',
	})
	return {
		blob: response.data as Blob,
		filename: filenameFromDisposition(
			response.headers['content-disposition'],
		),
	}
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

export async function listAgentRefs(): Promise<AgentRefOption[]> {
	const { data } = await api.get<AgentRefOption[]>('/refs/agents/', {
		params: { limit: 200 },
	})
	return data
}
