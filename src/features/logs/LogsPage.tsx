import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import { TextTruncate } from '@/components/TextTruncate'
import { TimeAgo } from '@/components/TimeAgo'
import { ListPage } from '@/components/list/ListPage'
import { ListPageProvider } from '@/components/list/ListPageContext'
import { FiltersPopover } from '@/components/list/FiltersPopover'
import { FilterSelect } from '@/components/list/FilterSelect'
import { FilterDate } from '@/components/list/FilterDate'
import type { AdminLogItem } from '@/types/api'
import { formatLogLabel } from './format'
import { SmsStatusCell } from './components/SmsStatusCell'
import { useLogsPage, ALL, SMS_STATUSES, type LogSlug } from './useLogsPage'

export function LogsPage({ slug }: { slug: LogSlug }) {
	const {
		view,
		showEventFilter,
		activeFilterCount,
		clearFilters,
		event, setEvent,
		sendStatus, setSendStatus,
		smsStatus, setSmsStatus,
		createdFrom, setCreatedFrom,
		createdTo, setCreatedTo,
		events,
		sendStatuses,
		...listCtx
	} = useLogsPage(slug)

	const columns = useMemo<ColumnDef<AdminLogItem, unknown>[]>(
		() => [
			{
				accessorKey: 'created_at',
				header: 'When',
				meta: { sortKey: 'created_at', className: 'w-25' },
				cell: ({ row }) => (
					<TimeAgo
						value={row.original.created_at}
						className="text-muted-foreground whitespace-nowrap"
					/>
				),
			},
			{
				accessorKey: 'event',
				header: 'Event',
				meta: { sortKey: 'event', className: 'w-45' },
				cell: ({ row }) => (
					<span className="font-medium">
						{formatLogLabel(row.original.event)}
					</span>
				),
			},
			{
				accessorKey: 'send_status',
				header: 'Status',
				meta: { sortKey: 'send_status', className: 'w-28' },
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
				accessorKey: 'sms_status',
				header: 'SMS',
				meta: { sortKey: 'sms_status', className: 'w-36' },
				cell: ({ row }) => <SmsStatusCell log={row.original} />,
			},
			{
				accessorKey: 'user_email',
				header: 'User',
				meta: { sortKey: 'user_email', className: 'w-56' },
				cell: ({ row }) =>
					row.original.user_email ? (
						<TextTruncate>{row.original.user_email}</TextTruncate>
					) : (
						<span className="text-muted-foreground">—</span>
					),
			},
			{
				accessorKey: 'description',
				header: 'Description',
				meta: { sortKey: 'description', className: 'w-82' },
				cell: ({ row }) =>
					row.original.description ?? (
						<span className="text-muted-foreground">—</span>
					),
			},
		],
		[],
	)

	return (
		<ListPageProvider value={listCtx}>
			<ListPage
				title={view.title}
				description={view.description}
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
						<FilterSelect
							label="SMS status"
							value={smsStatus}
							onChange={setSmsStatus}
							options={SMS_STATUSES.map((s) => ({
								value: s,
								label: formatLogLabel(s),
							}))}
							allOption={{ value: ALL, label: 'All SMS statuses' }}
						/>
						<div className="grid grid-cols-2 gap-3">
							<FilterDate
								label="From"
								value={createdFrom}
								onChange={setCreatedFrom}
								max={createdTo || undefined}
							/>
							<FilterDate
								label="To"
								value={createdTo}
								onChange={setCreatedTo}
								min={createdFrom || undefined}
							/>
						</div>
					</FiltersPopover>
				}
				columns={columns}
				emptyMessage="No logs found"
				minWidth="1200px"
			/>
		</ListPageProvider>
	)
}
