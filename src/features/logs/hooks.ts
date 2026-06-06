import { useQuery } from '@tanstack/react-query'

import { getLogsMeta, listLogs, type LogFilters } from './api'

const KEY = 'logs'

export function useLogs(filters: LogFilters) {
	return useQuery({
		queryKey: [KEY, filters],
		queryFn: () => listLogs(filters),
	})
}

export function useLogsMeta() {
	return useQuery({
		queryKey: [KEY, 'meta'],
		queryFn: getLogsMeta,
		staleTime: 5 * 60_000,
	})
}
