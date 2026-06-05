import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/DataTable'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { PAGE_SIZE_OPTIONS } from '@/hooks/usePagination'
import type { Status } from '@/types/api'
import { useStatusesPage } from './useStatusesPage'

export function StatusesPage() {
	const { search, setSearch, data, isLoading, isFetching, pagination } =
		useStatusesPage()

	const columns = useMemo<ColumnDef<Status, unknown>[]>(
		() => [
			{ accessorKey: 'name', header: 'Name' },
			{
				accessorKey: 'label',
				header: 'Label',
				cell: ({ row }) => (
					<span className="text-muted-foreground">
						{row.original.label}
					</span>
				),
			},
			{
				accessorKey: 'priority',
				header: 'Priority',
				cell: ({ row }) => (
					<span className="tabular-nums">
						{row.original.priority}
					</span>
				),
			},
		],
		[],
	)

	return (
		<div>
			<PageHeader
				title="Statuses"
				description="Browse referral pipeline statuses"
			/>

			<div className="mb-4 flex flex-wrap gap-3 flex-col sm:items-center sm:flex-row">
				<div className="relative sm:max-w-xs flex-1">
					<Icon
						name="search"
						className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
					/>
					<Input
						placeholder="Search statuses…"
						className="pl-9"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>

				<Select
					value={String(pagination.count)}
					onValueChange={(v) => pagination.setCount(Number(v))}
				>
					<SelectTrigger className="ml-auto sm:w-36">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{PAGE_SIZE_OPTIONS.map((n) => (
							<SelectItem key={n} value={String(n)}>
								{n} per page
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<DataTable
				columns={columns}
				data={data?.items ?? []}
				isLoading={isLoading || isFetching}
				emptyMessage="No statuses found"
				minWidth="480px"
				skeletonRows={pagination.count}
				pagination={{
					page: pagination.page,
					pageCount: pagination.pageCount(data?.total ?? 0),
					onPageChange: pagination.goTo,
				}}
			/>
		</div>
	)
}
