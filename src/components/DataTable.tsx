import { flexRender, type Row } from '@tanstack/react-table'
import { DndContext, closestCenter } from '@dnd-kit/core'
import {
	restrictToParentElement,
	restrictToVerticalAxis,
} from '@dnd-kit/modifiers'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
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
import type { DataTableProps } from './DataTable.types'
import { getPageItems } from './DataTable.utils'
import { useDataTable } from './useDataTable'

export type {
	DataTableSorting,
	DataTableReorder,
	DataTableSelection,
	PaginationProps,
	DataTableProps,
} from './DataTable.types'

export function DataTable<TData>(props: DataTableProps<TData>) {
	const {
		columns,
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
	} = props

	const {
		table,
		sensors,
		reorderIds,
		handleDragEnd,
		rowMouseDown,
		handleRowClick,
		scrollRef,
		viewportWidth,
	} = useDataTable(props)

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
								// Expose sort state to assistive tech on the
								// header cell itself (per ARIA, `aria-sort` lives
								// on the `<th>`, not the inner button). 'none'
								// marks a sortable-but-unsorted column; omitted
								// entirely on non-sortable columns.
								const isSortable = !!(sorting && sortKey)
								const ariaSort = !isSortable
									? undefined
									: sorting.sortBy !== sortKey
										? 'none'
										: sorting.order === 'asc'
											? 'ascending'
											: 'descending'
								return (
									<TableHead
										key={header.id}
										aria-sort={ariaSort}
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
									role="status"
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
			<div
				className="relative overflow-hidden rounded-xl border border-border bg-card"
				aria-busy={isFetching || undefined}
			>
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
