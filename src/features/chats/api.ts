import { api } from '@/lib/api/client'
import type {
	AgentRefOption,
	Chat,
	ChatMedia,
	ChatMediaData,
	ChatMessage,
	ChatMessagesData,
	ChatsData,
	CreateChatDto,
	CreateChatMessageDto,
	UpdateChatDto,
	UpdateChatMessageDto,
} from '@/types/api'

// ---- Chats ----

export interface ChatFilters {
	offset: number
	count: number
	search?: string
}

export async function listChats(filters: ChatFilters): Promise<ChatsData> {
	const params: Record<string, string | number> = {
		offset: filters.offset,
		count: filters.count,
	}
	if (filters.search) params.search = filters.search

	const { data } = await api.get<ChatsData>('/chats/', { params })
	return data
}

export async function getChat(id: string): Promise<Chat> {
	const { data } = await api.get<Chat>(`/chats/${id}/`)
	return data
}

export async function createChat(dto: CreateChatDto): Promise<Chat> {
	const { data } = await api.post<Chat>('/chats/', dto)
	return data
}

export async function updateChat(
	id: string,
	dto: UpdateChatDto,
): Promise<Chat> {
	const { data } = await api.put<Chat>(`/chats/${id}/`, dto)
	return data
}

export async function deleteChat(id: string): Promise<void> {
	await api.delete(`/chats/${id}/`)
}

/** Lightweight chat list for pickers (the message form / messages filter). */
export async function listChatRefs(): Promise<Chat[]> {
	const { data } = await api.get<ChatsData>('/chats/', {
		params: { offset: 0, count: 500 },
	})
	return data.items
}

// ---- Messages ----

export interface ChatMessageFilters {
	offset: number
	count: number
	search?: string
	chat_id?: string
	user_id?: string
	is_read?: boolean
}

export async function listChatMessages(
	filters: ChatMessageFilters,
): Promise<ChatMessagesData> {
	const params: Record<string, string | number | boolean> = {
		offset: filters.offset,
		count: filters.count,
	}
	if (filters.search) params.search = filters.search
	if (filters.chat_id) params.chat_id = filters.chat_id
	if (filters.user_id) params.user_id = filters.user_id
	if (filters.is_read !== undefined) params.is_read = filters.is_read

	const { data } = await api.get<ChatMessagesData>('/chats/messages/', {
		params,
	})
	return data
}

export async function getChatMessage(id: string): Promise<ChatMessage> {
	const { data } = await api.get<ChatMessage>(`/chats/messages/${id}/`)
	return data
}

export async function createChatMessage(
	dto: CreateChatMessageDto,
): Promise<ChatMessage> {
	const { data } = await api.post<ChatMessage>('/chats/messages/', dto)
	return data
}

export async function updateChatMessage(
	id: string,
	dto: UpdateChatMessageDto,
): Promise<ChatMessage> {
	const { data } = await api.put<ChatMessage>(`/chats/messages/${id}/`, dto)
	return data
}

export async function deleteChatMessage(id: string): Promise<void> {
	await api.delete(`/chats/messages/${id}/`)
}

// ---- Media ----

export interface ChatMediaFilters {
	offset: number
	count: number
	message_id?: string
	user_id?: string
}

export async function listChatMedia(
	filters: ChatMediaFilters,
): Promise<ChatMediaData> {
	const params: Record<string, string | number> = {
		offset: filters.offset,
		count: filters.count,
	}
	if (filters.message_id) params.message_id = filters.message_id
	if (filters.user_id) params.user_id = filters.user_id

	const { data } = await api.get<ChatMediaData>('/chats/media/', { params })
	return data
}

export async function getChatMedia(id: string): Promise<ChatMedia> {
	const { data } = await api.get<ChatMedia>(`/chats/media/${id}/`)
	return data
}

export async function deleteChatMedia(id: string): Promise<void> {
	await api.delete(`/chats/media/${id}/`)
}

/** Agent options for the chat participant pickers. */
export async function listAgentRefs(): Promise<AgentRefOption[]> {
	const { data } = await api.get<AgentRefOption[]>('/refs/agents/', {
		params: { limit: 200 },
	})
	return data
}
