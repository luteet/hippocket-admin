import { useQuery } from '@tanstack/react-query'

import { listStatuses, type StatusFilters } from './api'

const KEY = 'statuses'

export function useStatuses(filters: StatusFilters) {
	return useQuery({
		queryKey: [KEY, filters],
		queryFn: () => listStatuses(filters),
	})
}
