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
	page: number
	hasPrev: boolean
	hasNext: boolean
	onPrev: () => void
	onNext: () => void
}

interface DataTableProps<TData> {
	columns: ColumnDef<TData, unknown>[]
	data: TData[]
	isLoading?: boolean
	emptyMessage?: string
	onRowClick?: (row: TData) => void
	pagination?: PaginationProps
}

export function DataTable<TData>({
	columns,
	data,
	isLoading,
	emptyMessage = 'No data',
	onRowClick,
	pagination,
}: DataTableProps<TData>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	})

	return (
		<div className="space-y-4">
			<div className="overflow-hidden rounded-xl border border-border bg-card">
				<Table>
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

			{pagination && (
				<div className="flex items-center justify-end gap-2">
					<span className="mr-2 text-sm text-muted-foreground">
						Page {pagination.page + 1}
					</span>
					<Button
						variant="outline"
						size="sm"
						onClick={pagination.onPrev}
						disabled={!pagination.hasPrev}
					>
						<ChevronLeft />
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={pagination.onNext}
						disabled={!pagination.hasNext}
					>
						Next
						<ChevronRight />
					</Button>
				</div>
			)}
		</div>
	)
}
