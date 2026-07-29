import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TimeAgo } from '@/components/TimeAgo'
import { ListPage } from '@/components/list/ListPage'
import { ListPageProvider } from '@/components/list/ListPageContext'
import type { Chat } from '@/types/api'
import { useChatsPage } from './useChatsPage'

export function ChatsPage() {
	const {
		goToCreate,
		...listCtx
	} = useChatsPage()

	const columns = useMemo<ColumnDef<Chat, unknown>[]>(
		() => [
			{
				accessorKey: 'user_list',
				header: 'Participants',
				meta: { className: 'w-56' },
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
		],
		[],
	)

	return (
		<ListPageProvider value={listCtx}>
			<ListPage
				title="Chats"
				description="Direct conversations between two agents"
				actions={
					<Button onClick={goToCreate}>
						<Icon name="plus" />
						Add
					</Button>
				}
				searchPlaceholder="Search chats…"
				columns={columns}
				emptyMessage="No chats found"
				minWidth="600px"
			/>
		</ListPageProvider>
	)
}
