import { useQuery } from '@tanstack/react-query'

import { listAgents, type AgentFilters } from './api'

const KEY = 'agents'

export function useAgents(filters: AgentFilters) {
	return useQuery({
		queryKey: [KEY, filters],
		queryFn: () => listAgents(filters),
	})
}
