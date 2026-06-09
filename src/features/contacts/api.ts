import { api } from '@/lib/api/client'
import type {
	AgentRefOption,
	Contact,
	ContactsData,
	CreateContactDto,
	SortParams,
	UpdateContactDto,
} from '@/types/api'

export interface ContactFilters extends SortParams {
	offset: number
	count: number
	search?: string
	is_deleted?: boolean
}

export async function listContacts(
	filters: ContactFilters,
): Promise<ContactsData> {
	const params: Record<string, string | number> = {
		offset: filters.offset,
		count: filters.count,
	}
	if (filters.search) params.search = filters.search
	if (filters.is_deleted !== undefined)
		params.is_deleted = String(filters.is_deleted)
	if (filters.sort_by) params.sort_by = filters.sort_by
	if (filters.order) params.order = filters.order

	const { data } = await api.get<ContactsData>('/contacts/', { params })
	return data
}

export async function getContact(id: string): Promise<Contact> {
	const { data } = await api.get<Contact>(`/contacts/${id}/`)
	return data
}

export async function createContact(dto: CreateContactDto): Promise<Contact> {
	const { data } = await api.post<Contact>('/contacts/', dto)
	return data
}

export async function updateContact(
	id: string,
	dto: UpdateContactDto,
): Promise<Contact> {
	const { data } = await api.put<Contact>(`/contacts/${id}/`, dto)
	return data
}

export async function deleteContact(id: string): Promise<void> {
	await api.delete(`/contacts/${id}/`)
}

/** Agent options for the contact owner picker. */
export async function listAgentRefs(): Promise<AgentRefOption[]> {
	const { data } = await api.get<AgentRefOption[]>('/refs/agents/', {
		params: { limit: 200 },
	})
	return data
}
