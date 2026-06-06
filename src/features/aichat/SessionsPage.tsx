import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ListPage } from '@/components/list/ListPage'
import type { AiSession } from '@/types/api'
import { useSessionsPage } from './useSessionsPage'
import { formatDateTime } from './format'

export function SessionsPage() {
	const {
		search,
		setSearch,
		data,
		isLoading,
		isFetching,
		pagination,
		goToCreate,
		openSession,
	} = useSessionsPage()

	const columns = useMemo<ColumnDef<AiSession, unknown>[]>(
		() => [
			{ accessorKey: 'user_email', header: 'User' },
			{
				accessorKey: 'messages_count',
				header: 'Messages',
				cell: ({ row }) => (
					<Badge variant="outline">
						{row.original.messages_count}
					</Badge>
				),
			},
			{
				accessorKey: 'created_at',
				header: 'Created',
				cell: ({ row }) => (
					<span className="text-muted-foreground">
						{formatDateTime(row.original.created_at)}
					</span>
				),
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated',
				cell: ({ row }) => (
					<span className="text-muted-foreground">
						{formatDateTime(row.original.updated_at)}
					</span>
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
			emptyMessage="No sessions found"
			minWidth="700px"
			onRowClick={(s) => openSession(s.id)}
		/>
	)
}
