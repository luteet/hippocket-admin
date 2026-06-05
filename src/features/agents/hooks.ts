import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { CreateAgentDto, UpdateAgentDto } from '@/types/api'
import {
	createAgent,
	deleteAgent,
	getAgent,
	listAgents,
	listGroupRefs,
	updateAgent,
	type AgentFilters,
} from './api'

const KEY = 'agents'

export function useAgents(filters: AgentFilters) {
	return useQuery({
		queryKey: [KEY, filters],
		queryFn: () => listAgents(filters),
	})
}

export function useAgent(id: string | undefined) {
	return useQuery({
		queryKey: [KEY, 'detail', id],
		queryFn: () => getAgent(id as string),
		enabled: !!id,
	})
}

export function useCreateAgent() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (dto: CreateAgentDto) => createAgent(dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

export function useUpdateAgent() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdateAgentDto }) =>
			updateAgent(id, dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

export function useDeleteAgent() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => deleteAgent(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

export function useGroupOptions() {
	return useQuery({
		queryKey: ['refs', 'groups'],
		queryFn: listGroupRefs,
		staleTime: 5 * 60_000,
	})
}
