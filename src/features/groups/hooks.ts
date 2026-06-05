import { useQuery } from '@tanstack/react-query'

import { listGroups, type GroupFilters } from './api'

const KEY = 'groups'

export function useGroups(filters: GroupFilters) {
	return useQuery({
		queryKey: [KEY, filters],
		queryFn: () => listGroups(filters),
	})
}
