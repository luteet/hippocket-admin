import { api } from '@/lib/api/client'
import type {
	Agent,
	AgentRole,
	AgentStatus,
	AgentsData,
	CreateAgentDto,
	GroupOption,
	UpdateAgentDto,
} from '@/types/api'

export interface AgentFilters {
	offset: number
	count: number
	search?: string
	role?: AgentRole
	status?: AgentStatus
	is_active?: boolean
}

export async function listAgents(filters: AgentFilters): Promise<AgentsData> {
	const params: Record<string, string | number> = {
		offset: filters.offset,
		count: filters.count,
	}
	if (filters.search) params.search = filters.search
	if (filters.role) params.role = filters.role
	if (filters.status) params.status = filters.status
	if (filters.is_active !== undefined)
		params.is_active = String(filters.is_active)

	const { data } = await api.get<AgentsData>('/agents/', { params })
	return data
}

export async function getAgent(id: string): Promise<Agent> {
	const { data } = await api.get<Agent>(`/agents/${id}/`)
	return data
}

export async function createAgent(dto: CreateAgentDto): Promise<Agent> {
	const { data } = await api.post<Agent>('/agents/', dto)
	return data
}

export async function updateAgent(
	id: string,
	dto: UpdateAgentDto,
): Promise<Agent> {
	const { data } = await api.put<Agent>(`/agents/${id}/`, dto)
	return data
}

export async function deleteAgent(id: string): Promise<void> {
	await api.delete(`/agents/${id}/`)
}

/**
 * Upload (replace) an agent's avatar. `PUT /agents/{id}/avatar/` takes a
 * `multipart/form-data` body with a single `file` field and returns the updated
 * agent (new link in `avatar_url`). Let axios set the multipart Content-Type
 * (and boundary) from the FormData — don't set it manually.
 */
export async function uploadAgentAvatar(
	id: string,
	file: File,
): Promise<Agent> {
	const form = new FormData()
	form.append('file', file)
	// The axios instance defaults to `Content-Type: application/json`; clear it
	// so axios detects the FormData and sets `multipart/form-data` *with the
	// boundary*. Without this the body is mangled and the `file` field is lost.
	const { data } = await api.put<Agent>(`/agents/${id}/avatar/`, form, {
		headers: { 'Content-Type': undefined },
	})
	return data
}

export async function listGroupRefs(): Promise<GroupOption[]> {
	const { data } = await api.get<GroupOption[]>('/refs/groups/')
	return data
}
