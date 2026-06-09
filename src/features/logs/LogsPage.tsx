import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import { ListPage } from '@/components/list/ListPage'
import { FiltersPopover } from '@/components/list/FiltersPopover'
import { FilterSelect } from '@/components/list/FilterSelect'
import { FilterDate } from '@/components/list/FilterDate'
import type { AdminLogItem } from '@/types/api'
import { formatLogLabel } from './format'
import { useLogsPage, ALL, type LogSlug } from './useLogsPage'

export function LogsPage({ slug }: { slug: LogSlug }) {
	const {
		view,
		showEventFilter,
		activeFilterCount,
		clearFilters,
		search,
		setSearch,
		event,
		setEvent,
		sendStatus,
		setSendStatus,
		createdFrom,
		setCreatedFrom,
		createdTo,
		setCreatedTo,
		events,
		sendStatuses,
		data,
		isLoading,
		isFetching,
		pagination,
		sorting,
	} = useLogsPage(slug)

	const columns = useMemo<ColumnDef<AdminLogItem, unknown>[]>(
		() => [
			{
				accessorKey: 'created_at',
				header: 'When',
				meta: { sortKey: 'created_at', className: 'w-40' },
				cell: ({ row }) => (
					<span className="text-muted-foreground whitespace-nowrap">
						{row.original.created_at.slice(0, 16)}
					</span>
				),
			},
			{
				accessorKey: 'event',
				header: 'Event',
				meta: { sortKey: 'event', className: 'w-44 min-w-35' },
				cell: ({ row }) => (
					<span className="font-medium">
						{formatLogLabel(row.original.event)}
					</span>
				),
			},
			{
				accessorKey: 'send_status',
				header: 'Status',
				meta: { sortKey: 'send_status', className: 'w-32' },
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
				meta: { sortKey: 'user_email', className: 'w-56' },
				cell: ({ row }) =>
					row.original.user_email ?? (
						<span className="text-muted-foreground">—</span>
					),
			},
			{
				accessorKey: 'description',
				header: 'Description',
				meta: { sortKey: 'description', className: 'w-72' },
				cell: ({ row }) =>
					row.original.description ?? (
						<span className="text-muted-foreground">—</span>
					),
			},
		],
		[],
	)

	return (
		<ListPage
			title={view.title}
			description={view.description}
			search={search}
			onSearchChange={setSearch}
			searchPlaceholder="Search email or description…"
			filters={
				<FiltersPopover
					activeCount={activeFilterCount}
					onClear={clearFilters}
				>
					{showEventFilter && (
						<FilterSelect
							label="Event"
							value={event}
							onChange={setEvent}
							options={events.map((e) => ({
								value: e,
								label: formatLogLabel(e),
							}))}
							allOption={{ value: ALL, label: 'All events' }}
						/>
					)}
					<FilterSelect
						label="Send status"
						value={sendStatus}
						onChange={setSendStatus}
						options={sendStatuses.map((s) => ({
							value: s,
							label: formatLogLabel(s),
						}))}
						allOption={{ value: ALL, label: 'All statuses' }}
					/>
					<div className="grid grid-cols-2 gap-3">
						<FilterDate
							label="From"
							value={createdFrom}
							onChange={setCreatedFrom}
						/>
						<FilterDate
							label="To"
							value={createdTo}
							onChange={setCreatedTo}
						/>
					</div>
				</FiltersPopover>
			}
			pagination={pagination}
			data={data}
			isLoading={isLoading}
			isFetching={isFetching}
			columns={columns}
			sorting={{
				sortBy: sorting.sortBy,
				order: sorting.order,
				onToggle: sorting.toggle,
			}}
			emptyMessage="No logs found"
			minWidth="1000px"
		/>
	)
}
