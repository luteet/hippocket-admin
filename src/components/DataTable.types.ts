import type { ReactNode } from 'react'
import type { ColumnDef, RowData } from '@tanstack/react-table'
import type { SortOrder } from '@/types/api'

// Opt-in per-column features via `meta` on a column def:
// - `className`: a class (e.g. a `min-w-[…]` width) applied to both the column's
//   header and body cells.
// - `sortKey`: the whitelisted `sort_by` key for server-side sorting; when set
//   (and the table gets a `sorting` prop) the header becomes a sort toggle.
declare module '@tanstack/react-table' {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface ColumnMeta<TData extends RowData, TValue> {
		className?: string
		sortKey?: string
	}
}

/** Server-side sorting wiring passed down from the page (see useSorting). */
export interface DataTableSorting {
	sortBy?: string
	order?: SortOrder
	onToggle: (key: string) => void
}

/**
 * Drag-and-drop row reordering wiring. When set, each row gets a leading drag
 * handle. Dragging is only allowed while {@link enabled} is true (i.e. the list
 * is in its natural order with no search/filter narrowing it), so the full,
 * correctly-ordered id set can be sent to the backend's `reorder/` endpoint.
 */
export interface DataTableReorder<TData> {
	/** A stable id for a row — the record's UUID (string) or int id. */
	getRowId: (row: TData) => string | number
	/** Receives the full id list in the new order after a successful drop. */
	onReorder: (ids: (string | number)[]) => void
	/** Whether dragging is currently permitted (handle stays visible but inert when false). */
	enabled: boolean
}

/**
 * Row-selection wiring (opt-in, controlled). When set, the table grows a leading
 * checkbox column — a per-row box plus a "select all on this page" header box.
 * Selection is keyed by the record id ({@link getRowId}); the owning page hook
 * holds `selectedIds` and clears it when the underlying rows change (page,
 * search, filter, sort). Because pagination is server-side, "select all" only
 * ever covers the rows currently on screen, not the whole dataset.
 */
export interface DataTableSelection<TData> {
	/** Stable row id — the record's UUID/int id. */
	getRowId: (row: TData) => string | number
	/** Current selection (controlled), keyed by row id. */
	selectedIds: (string | number)[]
	onSelectionChange: (ids: (string | number)[]) => void
}

export interface PaginationProps {
	/** Current 0-based page index. */
	page: number
	/** Total number of pages. */
	pageCount: number
	/** Jump to a 0-based page. */
	onPageChange: (page: number) => void
}

export interface DataTableProps<TData> {
	columns: ColumnDef<TData, unknown>[]
	data: TData[]
	isLoading?: boolean
	emptyMessage?: ReactNode
	onRowClick?: (row: TData) => void
	/**
	 * Re-fetch the current view. When set, a quiet refresh button is pinned to
	 * the top-right corner of the table card.
	 */
	onRefresh?: () => void
	/** Whether a background fetch is in flight (spins/disables the refresh button). */
	isFetching?: boolean
	pagination?: PaginationProps
	/**
	 * Server-side sorting state + toggle. When set, columns with a `meta.sortKey`
	 * render their header as a clickable sort toggle.
	 */
	sorting?: DataTableSorting
	/**
	 * Drag-and-drop row reordering. When set, rows gain a leading drag handle
	 * and (while `reorder.enabled`) can be dragged to reorder.
	 */
	reorder?: DataTableReorder<TData>
	/**
	 * Row selection (controlled). When set, a leading checkbox column appears and
	 * ticking rows updates `selection.selectedIds` via `onSelectionChange`.
	 */
	selection?: DataTableSelection<TData>
	/**
	 * Minimum table width (any CSS length). Below this the table scrolls
	 * horizontally instead of squeezing columns until text wraps.
	 */
	minWidth?: string
	/**
	 * Number of skeleton rows to render while loading. Defaults to 5; pass the
	 * current page size so the loading state matches the expected row count.
	 */
	skeletonRows?: number
	/**
	 * Pin the header row while the body scrolls (on by default). Set `false` for
	 * a short embedded table where a bounded inner scroll area would look off.
	 */
	stickyHeader?: boolean
}
