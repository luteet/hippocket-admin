import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type {
	CreateChatDto,
	CreateChatMessageDto,
	UpdateChatDto,
	UpdateChatMessageDto,
} from '@/types/api'
import {
	createChat,
	createChatMessage,
	deleteChat,
	deleteChatMedia,
	deleteChatMessage,
	getChat,
	getChatMedia,
	getChatMessage,
	listAgentRefs,
	listChatMedia,
	listChatMessages,
	listChatRefs,
	listChats,
	updateChat,
	updateChatMessage,
	type ChatFilters,
	type ChatMediaFilters,
	type ChatMessageFilters,
} from './api'

const CHATS_KEY = 'chats'
const MESSAGES_KEY = 'chat-messages'
const MEDIA_KEY = 'chat-media'

// ---- Chats ----

export function useChats(filters: ChatFilters) {
	return useQuery({
		queryKey: [CHATS_KEY, filters],
		queryFn: () => listChats(filters),
	})
}

export function useChat(id: string | undefined) {
	return useQuery({
		queryKey: [CHATS_KEY, 'detail', id],
		queryFn: () => getChat(id as string),
		enabled: !!id,
	})
}

export function useCreateChat() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (dto: CreateChatDto) => createChat(dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [CHATS_KEY] }),
	})
}

export function useUpdateChat() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdateChatDto }) =>
			updateChat(id, dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [CHATS_KEY] }),
	})
}

export function useDeleteChat() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => deleteChat(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: [CHATS_KEY] }),
	})
}

export function useChatRefs() {
	return useQuery({
		queryKey: ['refs', 'chats'],
		queryFn: listChatRefs,
		staleTime: 60_000,
	})
}

// ---- Messages ----

export function useChatMessages(filters: ChatMessageFilters) {
	return useQuery({
		queryKey: [MESSAGES_KEY, filters],
		queryFn: () => listChatMessages(filters),
	})
}

export function useChatMessage(id: string | undefined) {
	return useQuery({
		queryKey: [MESSAGES_KEY, 'detail', id],
		queryFn: () => getChatMessage(id as string),
		enabled: !!id,
	})
}

export function useCreateChatMessage() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (dto: CreateChatMessageDto) => createChatMessage(dto),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: [MESSAGES_KEY] })
			// A new message bumps the chat's messages_count.
			qc.invalidateQueries({ queryKey: [CHATS_KEY] })
		},
	})
}

export function useUpdateChatMessage() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdateChatMessageDto }) =>
			updateChatMessage(id, dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [MESSAGES_KEY] }),
	})
}

export function useDeleteChatMessage() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => deleteChatMessage(id),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: [MESSAGES_KEY] })
			qc.invalidateQueries({ queryKey: [CHATS_KEY] })
		},
	})
}

// ---- Media ----

export function useChatMediaList(filters: ChatMediaFilters) {
	return useQuery({
		queryKey: [MEDIA_KEY, filters],
		queryFn: () => listChatMedia(filters),
	})
}

export function useChatMedia(id: string | undefined) {
	return useQuery({
		queryKey: [MEDIA_KEY, 'detail', id],
		queryFn: () => getChatMedia(id as string),
		enabled: !!id,
	})
}

export function useDeleteChatMedia() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => deleteChatMedia(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: [MEDIA_KEY] }),
	})
}

// ---- Agents ----

export function useAgentRefOptions() {
	return useQuery({
		queryKey: ['refs', 'agents'],
		queryFn: listAgentRefs,
		staleTime: 5 * 60_000,
	})
}
