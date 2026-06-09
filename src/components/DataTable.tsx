import { useRef } from 'react'
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
	type ColumnDef,
	type RowData,
} from '@tanstack/react-table'
import { Icon } from '@/components/Icon'
import { SortableHeader } from '@/components/SortableHeader'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
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

interface PaginationProps {
	/** Current 0-based page index. */
	page: number
	/** Total number of pages. */
	pageCount: number
	/** Jump to a 0-based page. */
	onPageChange: (page: number) => void
}

/**
 * Page indices to render, with `'ellipsis'` gaps. Always shows the first and
 * last page plus a window around the current one (e.g. 1 … 4 5 6 … 20).
 */
function getPageItems(
	current: number,
	pageCount: number,
): (number | 'ellipsis')[] {
	const pages = new Set<number>([0, pageCount - 1])
	for (let i = current - 1; i <= current + 1; i++) {
		if (i >= 0 && i < pageCount) pages.add(i)
	}
	const sorted = [...pages].sort((a, b) => a - b)
	const items: (number | 'ellipsis')[] = []
	let prev = -1
	for (const p of sorted) {
		if (prev !== -1 && p - prev > 1) items.push('ellipsis')
		items.push(p)
		prev = p
	}
	return items
}

interface DataTableProps<TData> {
	columns: ColumnDef<TData, unknown>[]
	data: TData[]
	isLoading?: boolean
	emptyMessage?: string
	onRowClick?: (row: TData) => void
	pagination?: PaginationProps
	/**
	 * Server-side sorting state + toggle. When set, columns with a `meta.sortKey`
	 * render their header as a clickable sort toggle.
	 */
	sorting?: DataTableSorting
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
}

export function DataTable<TData>({
	columns,
	data,
	isLoading,
	emptyMessage = 'No data',
	onRowClick,
	pagination,
	sorting,
	minWidth,
	skeletonRows = 5,
}: DataTableProps<TData>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	})

	// Where the press started — used to tell a real click apart from a drag
	// (e.g. selecting text in an inline input). A drag releasing on the row
	// fires `click` on the row, so without this it would navigate. We only
	// trigger onRowClick for a genuine press-release on the row: the press must
	// have been recorded here (a control that stops its own mousedown — an inline
	// Select/Input — clears it, so its clicks, and any stray click an overlay
	// fires on close, never navigate) and the pointer must have barely moved.
	const downPos = useRef<{ x: number; y: number } | null>(null)

	const handleRowClick = onRowClick
		? (row: TData) => (e: React.MouseEvent) => {
				const start = downPos.current
				downPos.current = null
				if (
					!start ||
					Math.hypot(e.clientX - start.x, e.clientY - start.y) > 4
				) {
					return
				}
				onRowClick(row)
			}
		: undefined

	return (
		<div className="space-y-4">
			<div className="overflow-hidden rounded-xl border border-border bg-card">
				{/* Fixed layout once sorting is on: column widths come from the
				    header cells (set via each column's `meta.className`) instead
				    of the body content, so they don't jump when a sort reorders
				    the rows and the sort buttons stay put under the cursor. */}
				<Table
					className={sorting ? 'table-fixed' : undefined}
					style={minWidth ? { minWidth } : undefined}
				>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow
								key={headerGroup.id}
								className="hover:bg-transparent"
							>
								{headerGroup.headers.map((header) => {
									const sortKey =
										header.column.columnDef.meta?.sortKey
									const label = header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)
									return (
										<TableHead
											key={header.id}
											className={
												header.column.columnDef.meta
													?.className
											}
										>
											{sorting && sortKey ? (
												<SortableHeader
													label={label}
													sortKey={sortKey}
													sortBy={sorting.sortBy}
													order={sorting.order}
													onToggle={sorting.onToggle}
												/>
											) : (
												label
											)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					{/* Re-key so the tbody remounts on each skeleton⇄data swap,
					    replaying the `.table-fade` opacity transition instead of
					    snapping between the two states. */}
					<TableBody
						key={isLoading ? 'loading' : 'loaded'}
						className="table-fade"
					>
						{isLoading ? (
							Array.from({ length: skeletonRows }).map((_, i) => (
								<TableRow
									key={i}
									className="hover:bg-transparent"
								>
									{columns.map((_col, j) => (
										<TableCell key={j}>
											<Skeleton className="h-8 w-full" />
										</TableCell>
									))}
								</TableRow>
							))
						) : table.getRowModel().rows.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									onMouseDown={
										onRowClick
											? (e) => {
													downPos.current = {
														x: e.clientX,
														y: e.clientY,
													}
												}
											: undefined
									}
									onClick={handleRowClick?.(row.original)}
									className={
										onRowClick
											? 'cursor-pointer'
											: undefined
									}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											className={
												cell.column.columnDef.meta
													?.className
											}
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow className="hover:bg-transparent">
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center text-muted-foreground"
								>
									{emptyMessage}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{pagination && pagination.pageCount > 1 && (
				<div className="flex items-center justify-end gap-1">
					<Button
						variant="outline"
						size="sm"
						className="size-9 rounded-full"
						onClick={() =>
							pagination.onPageChange(pagination.page - 1)
						}
						disabled={pagination.page === 0}
					>
						<Icon name="chevron-left" />
					</Button>

					{getPageItems(pagination.page, pagination.pageCount).map(
						(item, i) =>
							item === 'ellipsis' ? (
								<span
									key={`ellipsis-${i}`}
									className="px-1 text-sm text-muted-foreground"
								>
									…
								</span>
							) : (
								<Button
									key={item}
									variant={
										item === pagination.page
											? 'default'
											: 'outline'
									}
									size="sm"
									className="size-9 rounded-full"
									onClick={() =>
										pagination.onPageChange(item)
									}
								>
									{item + 1}
								</Button>
							),
					)}

					<Button
						variant="outline"
						size="sm"
						className="size-9 rounded-full"
						onClick={() =>
							pagination.onPageChange(pagination.page + 1)
						}
						disabled={pagination.page >= pagination.pageCount - 1}
					>
						<Icon name="chevron-right" />
					</Button>
				</div>
			)}
		</div>
	)
}
