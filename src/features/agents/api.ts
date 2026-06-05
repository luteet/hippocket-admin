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

export async function listGroupRefs(): Promise<GroupOption[]> {
	const { data } = await api.get<GroupOption[]>('/refs/groups/')
	return data
}
