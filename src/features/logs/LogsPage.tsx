import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/DataTable'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { PAGE_SIZE_OPTIONS } from '@/hooks/usePagination'
import type { AdminLogItem } from '@/types/api'
import { formatLogLabel } from './format'
import { LogsFilters } from './components/LogsFilters'
import { LogsProvider, useLogsContext } from './LogsContext'
import { type LogSlug } from './useLogsPage'

export function LogsPage({ slug }: { slug: LogSlug }) {
	return (
		<LogsProvider slug={slug}>
			<LogsView />
		</LogsProvider>
	)
}

function LogsView() {
	const { view, search, setSearch, data, isLoading, isFetching, pagination } =
		useLogsContext()

	const columns = useMemo<ColumnDef<AdminLogItem, unknown>[]>(
		() => [
			{
				accessorKey: 'created_at',
				header: 'When',
				cell: ({ row }) => (
					<span className="text-muted-foreground whitespace-nowrap">
						{row.original.created_at.slice(0, 16)}
					</span>
				),
			},
			{
				accessorKey: 'event',
				header: 'Event',
				meta: { className: 'min-w-35' },
				cell: ({ row }) => (
					<span className="font-medium">{formatLogLabel(row.original.event)}</span>
				),
			},
			{
				accessorKey: 'send_status',
				header: 'Status',
				cell: ({ row }) => {
					const status = row.original.send_status
					if (!status)
						return <span className="text-muted-foreground">—</span>
					return (
						<Badge
							variant={status === 'send' ? 'success' : 'muted'}
						>
							{formatLogLabel(status)}
						</Badge>
					)
				},
			},
			{
				accessorKey: 'user_email',
				header: 'User',
				cell: ({ row }) =>
					row.original.user_email ?? (
						<span className="text-muted-foreground">—</span>
					),
			},
			{
				accessorKey: 'description',
				header: 'Description',
				cell: ({ row }) =>
					row.original.description ?? (
						<span className="text-muted-foreground">—</span>
					),
			},
		],
		[],
	)

	return (
		<div>
			<PageHeader title={view.title} description={view.description} />

			<div className="mb-4 flex flex-wrap gap-3 flex-col xs2:items-center xs2:flex-row">
				<div className="relative xs2:max-w-xs flex-1">
					<Icon
						name="search"
						className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
					/>
					<Input
						placeholder="Search email or description…"
						className="pl-9"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>

				<div className="ml-auto flex gap-3">
					<LogsFilters />

					<Select
						value={String(pagination.count)}
						onValueChange={(v) => pagination.setCount(Number(v))}
					>
						<SelectTrigger className="xs2:w-36">
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
			</div>

			<DataTable
				columns={columns}
				data={data?.items ?? []}
				isLoading={isLoading || isFetching}
				emptyMessage="No logs found"
				minWidth="1000px"
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
