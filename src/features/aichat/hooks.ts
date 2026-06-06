import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type {
	CreateAiMessageDto,
	CreateAiSessionDto,
	UpdateAiMessageDto,
} from '@/types/api'
import {
	createMessage,
	createSession,
	deleteMessage,
	deleteSession,
	getMessage,
	getSession,
	listAgentRefs,
	listMessages,
	listSessionRefs,
	listSessions,
	updateMessage,
	type MessageFilters,
	type SessionFilters,
} from './api'

const SESSIONS_KEY = 'ai-sessions'
const MESSAGES_KEY = 'ai-messages'

// ---- Sessions ----

export function useSessions(filters: SessionFilters) {
	return useQuery({
		queryKey: [SESSIONS_KEY, filters],
		queryFn: () => listSessions(filters),
	})
}

export function useSession(id: string | undefined) {
	return useQuery({
		queryKey: [SESSIONS_KEY, 'detail', id],
		queryFn: () => getSession(id as string),
		enabled: !!id,
	})
}

export function useCreateSession() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (dto: CreateAiSessionDto) => createSession(dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [SESSIONS_KEY] }),
	})
}

export function useDeleteSession() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => deleteSession(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: [SESSIONS_KEY] }),
	})
}

export function useSessionRefs() {
	return useQuery({
		queryKey: ['refs', 'ai-sessions'],
		queryFn: listSessionRefs,
		staleTime: 60_000,
	})
}

// ---- Messages ----

export function useMessages(filters: MessageFilters) {
	return useQuery({
		queryKey: [MESSAGES_KEY, filters],
		queryFn: () => listMessages(filters),
	})
}

export function useMessage(id: string | undefined) {
	return useQuery({
		queryKey: [MESSAGES_KEY, 'detail', id],
		queryFn: () => getMessage(id as string),
		enabled: !!id,
	})
}

export function useCreateMessage() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (dto: CreateAiMessageDto) => createMessage(dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [MESSAGES_KEY] }),
	})
}

export function useUpdateMessage() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdateAiMessageDto }) =>
			updateMessage(id, dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [MESSAGES_KEY] }),
	})
}

export function useDeleteMessage() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => deleteMessage(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: [MESSAGES_KEY] }),
	})
}

export function useAgentRefOptions() {
	return useQuery({
		queryKey: ['refs', 'agents'],
		queryFn: listAgentRefs,
		staleTime: 5 * 60_000,
	})
}
