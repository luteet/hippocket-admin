import { useQuery } from '@tanstack/react-query'

import { listReferenceOptions } from './api'

// Reference lists change rarely, so keep them fresh for a few minutes. The key
// is namespaced under 'refs' alongside the partner/agent pickers used elsewhere.
export function useReferenceOptions(key: string, endpoint: string) {
	return useQuery({
		queryKey: ['refs', key],
		queryFn: () => listReferenceOptions(endpoint),
		staleTime: 5 * 60_000,
	})
}
