import {
	flexRender,
	getCoreRowModel,
	useReactTable,
	type ColumnDef,
} from '@tanstack/react-table'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
	 * Minimum table width (any CSS length). Below this the table scrolls
	 * horizontally instead of squeezing columns until text wraps.
	 */
	minWidth?: string
}

export function DataTable<TData>({
	columns,
	data,
	isLoading,
	emptyMessage = 'No data',
	onRowClick,
	pagination,
	minWidth,
}: DataTableProps<TData>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	})

	return (
		<div className="space-y-4">
			<div className="overflow-hidden rounded-xl border border-border bg-card">
				<Table style={minWidth ? { minWidth } : undefined}>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow
								key={headerGroup.id}
								className="hover:bg-transparent"
							>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef
														.header,
													header.getContext(),
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{isLoading ? (
							Array.from({ length: 5 }).map((_, i) => (
								<TableRow
									key={i}
									className="hover:bg-transparent"
								>
									{columns.map((_col, j) => (
										<TableCell key={j}>
											<Skeleton className="h-4 w-full" />
										</TableCell>
									))}
								</TableRow>
							))
						) : table.getRowModel().rows.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									onClick={
										onRowClick
											? () => onRowClick(row.original)
											: undefined
									}
									className={
										onRowClick
											? 'cursor-pointer'
											: undefined
									}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
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
						<ChevronLeft />
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
						<ChevronRight />
					</Button>
				</div>
			)}
		</div>
	)
}
