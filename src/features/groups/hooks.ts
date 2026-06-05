import { useQuery } from '@tanstack/react-query'

import { getGroup, listGroups, type GroupFilters } from './api'

const KEY = 'groups'

export function useGroups(filters: GroupFilters) {
	return useQuery({
		queryKey: [KEY, filters],
		queryFn: () => listGroups(filters),
	})
}

export function useGroup(id: number | undefined) {
	return useQuery({
		queryKey: [KEY, 'detail', id],
		queryFn: () => getGroup(id as number),
		enabled: id !== undefined,
	})
}
