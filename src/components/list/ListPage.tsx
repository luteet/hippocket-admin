import type { ReactNode } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { PageHeader } from '@/components/layout/PageHeader'
import {
	DataTable,
	type DataTableReorder,
	type DataTableSelection,
	type DataTableSorting,
} from '@/components/DataTable'
import { Reveal } from '@/components/Reveal'
import type { Pagination } from '@/hooks/usePagination'
import { SearchInput } from './SearchInput'
import { PageSizeSelect } from './PageSizeSelect'
import { FilterChips, type ActiveFilter } from './FilterChips'
import { useListPageContext } from './ListPageContext'

interface ListPageProps<TData> {
	// Header
	title: string
	description?: string
	/** Header actions, typically the "Add" button. */
	actions?: ReactNode

	// Toolbar
	/** When omitted, falls back to ListPageContext. */
	search?: string
	/** When omitted, falls back to ListPageContext. */
	onSearchChange?: (value: string) => void
	searchPlaceholder?: string
	/** A <FiltersPopover> with the page's filter fields, if the page has any. */
	filters?: ReactNode
	/** Active filters, rendered as removable chips below the toolbar. */
	activeFilters?: ActiveFilter[]
	/** Clear a single filter by its param key (chip ×). */
	onRemoveFilter?: (key: string) => void
	/** Clear every active filter (chips' "Clear all"). */
	onClearFilters?: () => void
	/** Re-fetch the current view; when provided, renders a refresh button.
	 *  When omitted, falls back to ListPageContext. */
	onRefresh?: () => void

	// Data + pagination (the usePagination object and the list result)
	/** When omitted, falls back to ListPageContext. */
	pagination?: Pagination
	/** When omitted, falls back to ListPageContext. */
	data?: { items: TData[]; total: number }
	/** When omitted, falls back to ListPageContext. */
	isLoading?: boolean
	/** When omitted, falls back to ListPageContext. */
	isFetching?: boolean

	// Table
	columns: ColumnDef<TData, unknown>[]
	emptyMessage?: ReactNode
	minWidth?: string
	/** When omitted, falls back to ListPageContext. */
	onRowClick?: (row: TData) => void
	/** Server-side sorting wiring (from useSorting); enables sortable headers.
	 *  When omitted, falls back to ListPageContext. */
	sorting?: DataTableSorting
	/** Drag-and-drop row reordering wiring; adds a drag handle per row. */
	reorder?: DataTableReorder<TData>
	/** Row-selection wiring; adds a leading checkbox column for bulk actions. */
	selection?: DataTableSelection<TData>

	/** Extra content after the table (e.g. Partners' sticky save bar). */
	footer?: ReactNode
	/** Extra classes on the outer wrapper (e.g. `pb-24` when a footer bar shows). */
	className?: string
}

// The shared shell for every list page: a header, a toolbar (search + optional
// filters popover + page-size select), and a paginated DataTable, all wired to
// the page's `usePagination` object and `{ items, total }` result. Columns and
// any filter fields stay in the page file as config; this owns the boilerplate.
export function ListPage<TData>({
	title,
	description,
	actions,
	search: searchProp,
	onSearchChange: onSearchChangeProp,
	searchPlaceholder,
	filters,
	activeFilters,
	onRemoveFilter,
	onClearFilters,
	onRefresh: onRefreshProp,
	pagination: paginationProp,
	data: dataProp,
	isLoading: isLoadingProp,
	isFetching: isFetchingProp,
	columns,
	emptyMessage = 'No data',
	minWidth,
	onRowClick: onRowClickProp,
	sorting: sortingProp,
	reorder,
	selection,
	footer,
	className,
}: ListPageProps<TData>) {
	const ctx = useListPageContext()

	// Props take precedence; fall back to context values (if any).
	const search = searchProp ?? ctx?.search ?? ''
	const onSearchChange = onSearchChangeProp ?? ctx?.onSearchChange ?? (() => {})
	const onRefresh = onRefreshProp ?? ctx?.onRefresh
	const pagination = paginationProp ?? ctx?.pagination!
	const data = (dataProp ?? ctx?.data) as { items: TData[]; total: number } | undefined
	const isLoading = isLoadingProp ?? ctx?.isLoading
	const isFetching = isFetchingProp ?? ctx?.isFetching
	const onRowClick = (onRowClickProp ?? ctx?.onRowClick) as ((row: TData) => void) | undefined
	const sorting = sortingProp ?? ctx?.sorting
	return (
		<div className={className}>
			<Reveal index={0}>
				<PageHeader
					title={title}
					description={description}
					actions={actions}
				/>
			</Reveal>

			<Reveal index={1}>
				<div className="mb-4 flex flex-wrap gap-3 flex-col sm:items-center sm:flex-row">
					<SearchInput
						value={search}
						onChange={onSearchChange}
						placeholder={searchPlaceholder}
						className="sm:max-w-xs flex-1 min-w-40"
					/>

					<div className="ml-auto flex gap-3">
						{filters}
						<PageSizeSelect
							count={pagination.count}
							onCountChange={pagination.setCount}
						/>
					</div>
				</div>

				{activeFilters && onRemoveFilter && (
					<FilterChips
						filters={activeFilters}
						onRemove={onRemoveFilter}
						onClearAll={onClearFilters}
					/>
				)}

				<DataTable
					columns={columns}
					data={data?.items ?? []}
					isLoading={isLoading || isFetching}
					isFetching={isFetching}
					onRefresh={onRefresh}
					emptyMessage={emptyMessage}
					minWidth={minWidth}
					skeletonRows={pagination.count}
					onRowClick={onRowClick}
					sorting={sorting}
					reorder={reorder}
					selection={selection}
					pagination={{
						page: pagination.page,
						pageCount: pagination.pageCount(data?.total ?? 0),
						onPageChange: pagination.goTo,
					}}
				/>

				{footer}
			</Reveal>
		</div>
	)
}
