import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useCatalog } from './hooks'

// The partner-taxonomy sections (nested under Partners in the sidebar) are
// near-identical editable lists backed by a `/catalogs/*` (partner reference
// table) endpoint; only the labels, the path, and whether the records carry
// content (description/keywords) differ, so one set of pages is driven by this
// config. Note the two distinct category lists: "Categories"
// (`/catalogs/categories/`, the granular service categories, which alone carry
// description/keywords) vs "Segments" (`/catalogs/partner-categories/`, the
// broad partner groupings).
//
// The `kind` doubles as the route segment (`/categories`, `/segments`, …), so
// the create/detail/edit pages derive their paths from it directly.
export type ReferenceKind = 'categories' | 'segments' | 'locations' | 'services'

interface ReferenceConfig {
	/** Plural section title, e.g. "Categories". */
	title: string
	/** Singular noun used in form/detail titles and toasts, e.g. "Category". */
	singular: string
	description: string
	/** Catalogs (partner reference table) CRUD endpoint. */
	endpoint: string
	/**
	 * Suffix for the TanStack Query key (`['catalog', queryKey]`) and the
	 * matching `/refs/*` select key invalidated on mutation so the partner form
	 * stays in sync. The two share the same suffix by design.
	 */
	queryKey: string
	/** Categories alone carry editable description + keywords content. */
	hasContent: boolean
	/** Categories alone carry an uploadable icon (`PUT /catalogs/categories/{id}/icon/`). */
	hasIcon: boolean
	searchPlaceholder: string
	emptyMessage: string
}

export const REFERENCE_CONFIG: Record<ReferenceKind, ReferenceConfig> = {
	categories: {
		title: 'Categories',
		singular: 'Category',
		description: 'Service categories',
		endpoint: '/catalogs/categories/',
		queryKey: 'categories',
		hasContent: true,
		hasIcon: true,
		searchPlaceholder: 'Search categories…',
		emptyMessage: 'No categories found',
	},
	segments: {
		title: 'Segments',
		singular: 'Segment',
		description: 'Partner segments',
		endpoint: '/catalogs/partner-categories/',
		queryKey: 'partner-categories',
		hasContent: false,
		hasIcon: false,
		searchPlaceholder: 'Search segments…',
		emptyMessage: 'No segments found',
	},
	locations: {
		title: 'Locations',
		singular: 'Location',
		description: 'Partner service locations',
		endpoint: '/catalogs/partner-locations/',
		queryKey: 'partner-locations',
		hasContent: false,
		hasIcon: false,
		searchPlaceholder: 'Search locations…',
		emptyMessage: 'No locations found',
	},
	services: {
		title: 'Services',
		singular: 'Service',
		description: 'Partner service types',
		endpoint: '/catalogs/partner-services/',
		queryKey: 'partner-services',
		hasContent: false,
		hasIcon: false,
		searchPlaceholder: 'Search services…',
		emptyMessage: 'No services found',
	},
}

export function useReferenceListPage(kind: ReferenceKind) {
	const config = REFERENCE_CONFIG[kind]
	const navigate = useNavigate()
	const [search, setSearch] = useState('')
	const debouncedSearch = useDebouncedValue(search)

	// These lists are short, so fetch them whole and filter/search client-side
	// (preserving the no-pagination UX these sections always had).
	const { data, isLoading, isFetching } = useCatalog(
		config.queryKey,
		config.endpoint,
		{ offset: 0, count: 1000 },
	)

	const rows = useMemo(() => {
		const items = data?.items ?? []
		const query = debouncedSearch.trim().toLowerCase()
		if (!query) return items
		return items.filter((o) => o.name.toLowerCase().includes(query))
	}, [data, debouncedSearch])

	return {
		config,
		rows,
		total: data?.total ?? 0,
		search,
		setSearch,
		isLoading,
		isFetching,
		goToCreate: () => navigate(`/${kind}/new`),
		openItem: (id: string) => navigate(`/${kind}/${id}`),
	}
}
