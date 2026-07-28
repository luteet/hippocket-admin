import { createContext, useContext, type ReactNode } from 'react'

import type { Pagination } from '@/hooks/usePagination'
import type { DataTableSorting } from '@/components/DataTable'

export interface ListPageContextValue {
	// Search
	search: string
	onSearchChange: (value: string) => void

	// Refresh
	onRefresh?: () => void

	// Pagination + data
	pagination: Pagination
	data?: { items: unknown[]; total: number }
	isLoading?: boolean
	isFetching?: boolean

	// Sorting
	sorting?: DataTableSorting

	// Row click
	onRowClick?: (row: unknown) => void
}

const ListPageContext = createContext<ListPageContextValue | null>(null)

export function ListPageProvider({
	value,
	children,
}: {
	value: ListPageContextValue
	children: ReactNode
}) {
	return (
		<ListPageContext.Provider value={value}>
			{children}
		</ListPageContext.Provider>
	)
}

export function useListPageContext(): ListPageContextValue | null {
	return useContext(ListPageContext)
}
