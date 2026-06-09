import { api } from '@/lib/api/client'
import type {
	AgentRefOption,
	AiMessage,
	AiMessageRole,
	AiMessagesData,
	AiSession,
	AiSessionsData,
	CreateAiMessageDto,
	CreateAiSessionDto,
	SortParams,
	UpdateAiMessageDto,
} from '@/types/api'

// ---- Sessions ----

export interface SessionFilters extends SortParams {
	offset: number
	count: number
	search?: string
}

export async function listSessions(
	filters: SessionFilters,
): Promise<AiSessionsData> {
	const params: Record<string, string | number> = {
		offset: filters.offset,
		count: filters.count,
	}
	if (filters.search) params.search = filters.search
	if (filters.sort_by) params.sort_by = filters.sort_by
	if (filters.order) params.order = filters.order

	const { data } = await api.get<AiSessionsData>('/ai-chat/sessions/', {
		params,
	})
	return data
}

export async function getSession(id: string): Promise<AiSession> {
	const { data } = await api.get<AiSession>(`/ai-chat/sessions/${id}/`)
	return data
}

export async function createSession(
	dto: CreateAiSessionDto,
): Promise<AiSession> {
	const { data } = await api.post<AiSession>('/ai-chat/sessions/', dto)
	return data
}

export async function deleteSession(id: string): Promise<void> {
	await api.delete(`/ai-chat/sessions/${id}/`)
}

/** Lightweight session list for pickers (the message form / filter). */
export async function listSessionRefs(): Promise<AiSession[]> {
	const { data } = await api.get<AiSessionsData>('/ai-chat/sessions/', {
		params: { offset: 0, count: 500 },
	})
	return data.items
}

// ---- Messages ----

export interface MessageFilters extends SortParams {
	offset: number
	count: number
	search?: string
	session_id?: string
	role?: AiMessageRole
}

export async function listMessages(
	filters: MessageFilters,
): Promise<AiMessagesData> {
	const params: Record<string, string | number> = {
		offset: filters.offset,
		count: filters.count,
	}
	if (filters.search) params.search = filters.search
	if (filters.session_id) params.session_id = filters.session_id
	if (filters.role) params.role = filters.role
	if (filters.sort_by) params.sort_by = filters.sort_by
	if (filters.order) params.order = filters.order

	const { data } = await api.get<AiMessagesData>('/ai-chat/messages/', {
		params,
	})
	return data
}

export async function getMessage(id: string): Promise<AiMessage> {
	const { data } = await api.get<AiMessage>(`/ai-chat/messages/${id}/`)
	return data
}

export async function createMessage(
	dto: CreateAiMessageDto,
): Promise<AiMessage> {
	const { data } = await api.post<AiMessage>('/ai-chat/messages/', dto)
	return data
}

export async function updateMessage(
	id: string,
	dto: UpdateAiMessageDto,
): Promise<AiMessage> {
	const { data } = await api.put<AiMessage>(`/ai-chat/messages/${id}/`, dto)
	return data
}

export async function deleteMessage(id: string): Promise<void> {
	await api.delete(`/ai-chat/messages/${id}/`)
}

/** Agent options for the session form's user picker. */
export async function listAgentRefs(): Promise<AgentRefOption[]> {
	const { data } = await api.get<AgentRefOption[]>('/refs/agents/', {
		params: { limit: 200 },
	})
	return data
}
