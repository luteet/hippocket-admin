import { useMemo, useState } from 'react'

import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useReferenceOptions } from './hooks'

// The three partner-taxonomy sections (nested under Partners in the sidebar) are
// identical read-only lists backed by the matching `/refs/partner-*` endpoint;
// only the labels and the path differ, so one page is driven by this config.
export type ReferenceKind = 'categories' | 'locations' | 'services'

interface ReferenceConfig {
	title: string
	description: string
	/** Reference-data (selects) endpoint returning `[{ id, name }]`. */
	endpoint: string
	/** Suffix for the TanStack Query key (`['refs', queryKey]`). */
	queryKey: string
	searchPlaceholder: string
	emptyMessage: string
}

export const REFERENCE_CONFIG: Record<ReferenceKind, ReferenceConfig> = {
	categories: {
		title: 'Categories',
		description: 'Partner categories',
		endpoint: '/refs/partner-categories/',
		queryKey: 'partner-categories',
		searchPlaceholder: 'Search categories…',
		emptyMessage: 'No categories found',
	},
	locations: {
		title: 'Locations',
		description: 'Partner service locations',
		endpoint: '/refs/partner-locations/',
		queryKey: 'partner-locations',
		searchPlaceholder: 'Search locations…',
		emptyMessage: 'No locations found',
	},
	services: {
		title: 'Services',
		description: 'Partner service types',
		endpoint: '/refs/partner-services/',
		queryKey: 'partner-services',
		searchPlaceholder: 'Search services…',
		emptyMessage: 'No services found',
	},
}

export function useReferenceListPage(kind: ReferenceKind) {
	const config = REFERENCE_CONFIG[kind]
	const [search, setSearch] = useState('')
	const debouncedSearch = useDebouncedValue(search)

	const { data, isLoading, isFetching } = useReferenceOptions(
		config.queryKey,
		config.endpoint,
	)

	// The endpoints don't support search, but the lists are short, so filter
	// client-side by name.
	const rows = useMemo(() => {
		const items = data ?? []
		const query = debouncedSearch.trim().toLowerCase()
		if (!query) return items
		return items.filter((o) => o.name.toLowerCase().includes(query))
	}, [data, debouncedSearch])

	return {
		config,
		rows,
		total: data?.length ?? 0,
		search,
		setSearch,
		isLoading,
		isFetching,
	}
}
