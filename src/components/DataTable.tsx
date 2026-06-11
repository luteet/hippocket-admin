import {
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
	type ReactNode,
} from 'react'
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
	type ColumnDef,
	type Row,
	type RowData,
	type RowSelectionState,
} from '@tanstack/react-table'
import {
	DndContext,
	KeyboardSensor,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
	type DragEndEvent,
} from '@dnd-kit/core'
import {
	restrictToParentElement,
	restrictToVerticalAxis,
} from '@dnd-kit/modifiers'
import {
	SortableContext,
	arrayMove,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Icon } from '@/components/Icon'
import { SortableHeader } from '@/components/SortableHeader'
import { SortableRow } from '@/components/SortableRow'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { RefreshButton } from '@/components/list/RefreshButton'
import { Checkbox } from '@/components/ui/checkbox'
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

export function DataTable<TData>({
	columns,
	data,
	isLoading,
	emptyMessage = 'No data',
	onRowClick,
	onRefresh,
	isFetching,
	pagination,
	sorting,
	reorder,
	selection,
	minWidth,
	skeletonRows = 5,
	stickyHeader = true,
}: DataTableProps<TData>) {
	// A local mirror of the rows so a drop reorders them synchronously. dnd-kit
	// resets the dragged row's transform on drop; if the order hasn't changed
	// yet, the row snaps back to its origin for a frame before the (async) cache
	// update moves it. Updating this state inside `onDragEnd` flips the order in
	// the same frame, so the row settles straight into its new slot. Resetting
	// it during render (the React-blessed "derive state from props" pattern)
	// keeps it in sync with later data changes (refetch, search, sort).
	const [orderedData, setOrderedData] = useState(data)
	const [prevData, setPrevData] = useState(data)
	if (data !== prevData) {
		setPrevData(data)
		setOrderedData(data)
	}
	const tableData = reorder ? orderedData : data

	// Both reorder and selection key rows by the record id (not the row index):
	// reorder needs it so dnd-kit moves the real DOM node, selection needs it so
	// the controlled `selectedIds` survive a refetch/reorder of the rows.
	const rowIdOf = reorder?.getRowId ?? selection?.getRowId

	// Mirror the controlled `selectedIds` into TanStack's row-selection model
	// (`{ [id]: true }`). Driving the table's own model keeps "select all on
	// page" / indeterminate header state correct for free.
	const rowSelection = useMemo<RowSelectionState>(() => {
		const state: RowSelectionState = {}
		selection?.selectedIds.forEach((id) => {
			state[String(id)] = true
		})
		return state
	}, [selection?.selectedIds])

	const table = useReactTable({
		data: tableData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getRowId: rowIdOf ? (row) => String(rowIdOf(row)) : undefined,
		enableRowSelection: !!selection,
		state: selection ? { rowSelection } : undefined,
		onRowSelectionChange: selection
			? (updater) => {
					const next =
						typeof updater === 'function'
							? updater(rowSelection)
							: updater
					selection.onSelectionChange(
						Object.keys(next).filter((id) => next[id]),
					)
				}
			: undefined,
	})

	// Drag-and-drop reordering plumbing (no-op unless `reorder` is supplied).
	const sensors = useSensors(
		// A small activation distance so a click on the handle still reads as a
		// click, not a drag.
		useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)
	const reorderIds = useMemo(
		() => (reorder ? tableData.map(reorder.getRowId) : []),
		[reorder, tableData],
	)
	const handleDragEnd = (event: DragEndEvent) => {
		if (!reorder) return
		const { active, over } = event
		if (!over || active.id === over.id) return
		const oldIndex = reorderIds.findIndex((id) => id === active.id)
		const newIndex = reorderIds.findIndex((id) => id === over.id)
		if (oldIndex === -1 || newIndex === -1) return
		const next = arrayMove(orderedData, oldIndex, newIndex)
		setOrderedData(next)
		reorder.onReorder(next.map(reorder.getRowId))
	}

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

	const rowMouseDown = onRowClick
		? (e: React.MouseEvent<HTMLTableRowElement>) => {
				downPos.current = { x: e.clientX, y: e.clientY }
			}
		: undefined

	const renderCells = (row: Row<TData>) => [
		// Leading per-row selection checkbox. The wrapper stops its own mousedown
		// and click so ticking the box never registers as a row press (the
		// `downPos` guard above only navigates when the row itself recorded the
		// press) and so it never bubbles to onRowClick.
		selection ? (
			<TableCell
				key="__select"
				className="w-10"
				onMouseDown={(e) => e.stopPropagation()}
				onClick={(e) => e.stopPropagation()}
			>
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
				/>
			</TableCell>
		) : null,
		...row.getVisibleCells().map((cell) => (
			<TableCell
				key={cell.id}
				className={cell.column.columnDef.meta?.className}
			>
				{flexRender(cell.column.columnDef.cell, cell.getContext())}
			</TableCell>
		)),
	]

	// When the table is empty, the placeholder cell spans every column, so on a
	// wide (horizontally scrolling) table its centered content would sit far off
	// to the right. We instead pin it to the scroll container's *visible* width:
	// measure that width here and render the empty block `sticky left-0` at that
	// size, so it stays centered in view as the table scrolls sideways.
	const scrollRef = useRef<HTMLDivElement>(null)
	const isEmpty = !isLoading && table.getRowModel().rows.length === 0
	const [viewportWidth, setViewportWidth] = useState<number>()
	useLayoutEffect(() => {
		const el = scrollRef.current
		if (!el || !isEmpty) return
		const update = () => setViewportWidth(el.clientWidth)
		update()
		const ro = new ResizeObserver(update)
		ro.observe(el)
		return () => ro.disconnect()
	}, [isEmpty])

	const dataRows = table.getRowModel().rows.map((row) =>
		reorder ? (
			<SortableRow
				key={row.id}
				id={reorder.getRowId(row.original)}
				disabled={!reorder.enabled}
				clickable={!!onRowClick}
				onMouseDown={rowMouseDown}
				onClick={handleRowClick?.(row.original)}
			>
				{renderCells(row)}
			</SortableRow>
		) : (
			<TableRow
				key={row.id}
				onMouseDown={rowMouseDown}
				onClick={handleRowClick?.(row.original)}
				className={onRowClick ? 'cursor-pointer' : undefined}
			>
				{renderCells(row)}
			</TableRow>
		),
	)

	const tableEl = (
		<>
			{/* Fixed layout once sorting is on: column widths come from the
				    header cells (set via each column's `meta.className`) instead
				    of the body content, so they don't jump when a sort reorders
				    the rows and the sort buttons stay put under the cursor. */}
			<Table
				className={sorting ? 'table-fixed' : undefined}
				stickyHeader={stickyHeader}
				scrollRef={scrollRef}
				style={minWidth ? { minWidth } : undefined}
			>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow
							key={headerGroup.id}
							className="hover:bg-transparent"
						>
							{reorder && (
								<TableHead className="w-10" aria-hidden />
							)}
							{selection && (
								<TableHead className="w-10">
									<Checkbox
										checked={
											table.getIsAllPageRowsSelected()
												? true
												: table.getIsSomePageRowsSelected()
													? 'indeterminate'
													: false
										}
										onCheckedChange={(value) =>
											table.toggleAllPageRowsSelected(
												!!value,
											)
										}
										aria-label="Select all rows on this page"
									/>
								</TableHead>
							)}
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
							<TableRow key={i} className="hover:bg-transparent">
								{reorder && <TableCell className="w-10" />}
								{selection && <TableCell className="w-10" />}
								{columns.map((_col, j) => (
									<TableCell key={j}>
										<Skeleton className="h-8 w-full" />
									</TableCell>
								))}
							</TableRow>
						))
					) : dataRows.length ? (
						reorder ? (
							<SortableContext
								items={reorderIds}
								strategy={verticalListSortingStrategy}
							>
								{dataRows}
							</SortableContext>
						) : (
							dataRows
						)
					) : (
						<TableRow className="hover:bg-transparent">
							<TableCell
								colSpan={
									columns.length +
									(reorder ? 1 : 0) +
									(selection ? 1 : 0)
								}
								className="p-0"
							>
								{/* Pinned to the left of the scroll viewport and
								    sized to its visible width, so the message stays
								    centered on screen however wide the table is. */}
								<div
									className="sticky left-0 flex min-h-24 items-center justify-center text-center text-muted-foreground"
									style={{ width: viewportWidth }}
								>
									{emptyMessage}
								</div>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</>
	)

	return (
		<div className="space-y-4">
			<div className="relative overflow-hidden rounded-xl border border-border bg-card">
				{onRefresh && (
					<RefreshButton
						onRefresh={onRefresh}
						isFetching={isFetching}
						className="absolute right-4 top-0.75 z-20 size-8 bg-white border border-muted text-muted-foreground"
					/>
				)}
				{reorder ? (
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						// Vertical-only, and clamped to the tbody so a row dragged
						// past the last one can't push its transform beyond the
						// content and grow the table's scroll area. autoScroll off
						// for the same reason — no edge-scrolling the container.
						modifiers={[
							restrictToVerticalAxis,
							restrictToParentElement,
						]}
						autoScroll={false}
						onDragEnd={handleDragEnd}
					>
						{tableEl}
					</DndContext>
				) : (
					tableEl
				)}
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
