import { useQuery } from '@tanstack/react-query'

import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import type { EntityScope } from './scopes'

/**
 * Live search for whichever entity scope is active in the command palette.
 * Debounces the query and only fires while a scope is active and a query is
 * present, so entering a scope with an empty input doesn't hit the API.
 */
export function useScopeResults(scope: EntityScope | null, query: string) {
	const debounced = useDebouncedValue(query).trim()
	const enabled = !!scope && debounced.length > 0

	const { data, isFetching } = useQuery({
		queryKey: ['search', scope?.key ?? 'none', debounced],
		queryFn: () => scope!.search(debounced),
		enabled,
		staleTime: 30_000,
	})

	return {
		results: data ?? [],
		isLoading: enabled && isFetching,
		hasQuery: debounced.length > 0,
	}
}
