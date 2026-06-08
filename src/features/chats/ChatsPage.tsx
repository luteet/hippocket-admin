import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ListPage } from '@/components/list/ListPage'
import type { Chat } from '@/types/api'
import { useChatsPage } from './useChatsPage'
import { formatDateTime } from './format'

export function ChatsPage() {
	const {
		search,
		setSearch,
		data,
		isLoading,
		isFetching,
		pagination,
		goToCreate,
		openChat,
	} = useChatsPage()

	const columns = useMemo<ColumnDef<Chat, unknown>[]>(
		() => [
			{ accessorKey: 'user_list', header: 'Participants' },
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
		],
		[],
	)

	return (
		<ListPage
			title="Chats"
			description="Direct conversations between two agents"
			actions={
				<Button onClick={goToCreate}>
					<Icon name="plus" />
					Add
				</Button>
			}
			search={search}
			onSearchChange={setSearch}
			searchPlaceholder="Search chats…"
			pagination={pagination}
			data={data}
			isLoading={isLoading}
			isFetching={isFetching}
			columns={columns}
			emptyMessage="No chats found"
			minWidth="600px"
			onRowClick={(c) => openChat(c.id)}
		/>
	)
}
