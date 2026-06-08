import { api } from '@/lib/api/client'
import type {
	AgentRefOption,
	AgentsData,
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

/** One page of agent options for the owner (`agent_email`) picker. */
export interface AgentSearchPage {
	items: AgentRefOption[]
	offset: number
	total: number
}

/** Page size for the agent picker's infinite scroll. */
export const AGENTS_PAGE_SIZE = 30

/**
 * Search agents for the owner picker, one page at a time. `/refs/agents/`
 * ignores `offset` (can't paginate), so we use the paginated `/agents/`
 * endpoint — it supports `search` (email/first/last/username) plus
 * `offset`/`count` — and map its rows down to the lightweight option shape.
 */
export async function searchAgents(
	search: string,
	offset: number,
): Promise<AgentSearchPage> {
	const trimmed = search.trim()
	const { data } = await api.get<AgentsData>('/agents/', {
		params: {
			offset,
			count: AGENTS_PAGE_SIZE,
			...(trimmed ? { search: trimmed } : {}),
		},
	})
	return {
		items: data.items.map((a) => ({
			id: a.id,
			email: a.email,
			name:
				[a.first_name, a.last_name].filter(Boolean).join(' ') ||
				a.username,
		})),
		offset,
		total: data.total,
	}
}

/** Partner options for the entry picker. */
export async function listPartnerRefs(): Promise<RefOption[]> {
	const { data } = await api.get<RefOption[]>('/refs/partners/', {
		params: { limit: 500 },
	})
	return data
}
