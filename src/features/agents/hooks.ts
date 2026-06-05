import { useQuery } from '@tanstack/react-query'

import { getAgent, listAgents, type AgentFilters } from './api'

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
