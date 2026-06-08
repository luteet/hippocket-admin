import { api } from '@/lib/api/client'
import type {
	AgentRefOption,
	CreateSharedPartnerDto,
	CreateSharedPartnerEntryDto,
	RefOption,
	SharedPartner,
	SharedPartnerEntry,
	SharedPartnersData,
	UpdateSharedPartnerDto,
	UpdateSharedPartnerEntryDto,
} from '@/types/api'

// ---- Shared partners ----

export interface SharedPartnerFilters {
	offset: number
	count: number
	search?: string
}

export async function listSharedPartners(
	filters: SharedPartnerFilters,
): Promise<SharedPartnersData> {
	const params: Record<string, string | number> = {
		offset: filters.offset,
		count: filters.count,
	}
	if (filters.search) params.search = filters.search

	const { data } = await api.get<SharedPartnersData>('/shared-partners/', {
		params,
	})
	return data
}

export async function getSharedPartner(id: string): Promise<SharedPartner> {
	const { data } = await api.get<SharedPartner>(`/shared-partners/${id}/`)
	return data
}

export async function createSharedPartner(
	dto: CreateSharedPartnerDto,
): Promise<SharedPartner> {
	const { data } = await api.post<SharedPartner>('/shared-partners/', dto)
	return data
}

export async function updateSharedPartner(
	id: string,
	dto: UpdateSharedPartnerDto,
): Promise<SharedPartner> {
	const { data } = await api.put<SharedPartner>(
		`/shared-partners/${id}/`,
		dto,
	)
	return data
}

export async function deleteSharedPartner(id: string): Promise<void> {
	await api.delete(`/shared-partners/${id}/`)
}

// ---- Entries (pinned partners within a shared list) ----

export async function addSharedPartnerEntry(
	sharedId: string,
	dto: CreateSharedPartnerEntryDto,
): Promise<SharedPartnerEntry> {
	const { data } = await api.post<SharedPartnerEntry>(
		`/shared-partners/${sharedId}/entries/`,
		dto,
	)
	return data
}

export async function updateSharedPartnerEntry(
	sharedId: string,
	entryId: string,
	dto: UpdateSharedPartnerEntryDto,
): Promise<SharedPartnerEntry> {
	const { data } = await api.put<SharedPartnerEntry>(
		`/shared-partners/${sharedId}/entries/${entryId}/`,
		dto,
	)
	return data
}

export async function deleteSharedPartnerEntry(
	sharedId: string,
	entryId: string,
): Promise<void> {
	await api.delete(`/shared-partners/${sharedId}/entries/${entryId}/`)
}

// ---- Reference pickers ----

/**
 * Agent options for the owner (`agent_email`) picker. There are more agents in
 * the system than `limit` returns, so the picker searches server-side: pass the
 * user's query as `search` (matches email/first/last/username) to narrow the
 * list instead of trying to load every agent.
 */
export async function listAgentRefs(
	search?: string,
): Promise<AgentRefOption[]> {
	const trimmed = search?.trim()
	const { data } = await api.get<AgentRefOption[]>('/refs/agents/', {
		params: { limit: 200, ...(trimmed ? { search: trimmed } : {}) },
	})
	return data
}

/** Partner options for the entry picker. */
export async function listPartnerRefs(): Promise<RefOption[]> {
	const { data } = await api.get<RefOption[]>('/refs/partners/', {
		params: { limit: 500 },
	})
	return data
}
