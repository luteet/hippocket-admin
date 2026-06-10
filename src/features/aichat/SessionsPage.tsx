import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TimeAgo } from '@/components/TimeAgo'
import { ListPage } from '@/components/list/ListPage'
import type { AiSession } from '@/types/api'
import { useSessionsPage } from './useSessionsPage'

export function SessionsPage() {
	const {
		search,
		setSearch,
		data,
		isLoading,
		isFetching,
		pagination,
		sorting,
		goToCreate,
		openSession,
	} = useSessionsPage()

	const columns = useMemo<ColumnDef<AiSession, unknown>[]>(
		() => [
			{
				accessorKey: 'user_email',
				header: 'User',
				meta: { sortKey: 'user_email', className: 'w-64' },
			},
			{
				accessorKey: 'messages_count',
				header: 'Messages',
				meta: { sortKey: 'messages_count', className: 'w-32' },
				cell: ({ row }) => (
					<Badge variant="outline">
						{row.original.messages_count}
					</Badge>
				),
			},
			{
				accessorKey: 'created_at',
				header: 'Created',
				meta: { sortKey: 'created_at', className: 'w-40' },
				cell: ({ row }) => (
					<TimeAgo
						value={row.original.created_at}
						className="text-muted-foreground"
					/>
				),
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated',
				meta: { sortKey: 'updated_at', className: 'w-40' },
				cell: ({ row }) => (
					<TimeAgo
						value={row.original.updated_at}
						className="text-muted-foreground"
					/>
				),
			},
		],
		[],
	)

	return (
		<ListPage
			title="AI Chat Sessions"
			description="Conversations between agents and the AI assistant"
			actions={
				<Button onClick={goToCreate}>
					<Icon name="plus" />
					Add
				</Button>
			}
			search={search}
			onSearchChange={setSearch}
			searchPlaceholder="Search sessions…"
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
			emptyMessage="No sessions found"
			minWidth="700px"
			onRowClick={(s) => openSession(s.id)}
		/>
	)
}
