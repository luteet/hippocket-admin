import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { TextTruncate } from '@/components/TextTruncate'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TimeAgo } from '@/components/TimeAgo'
import { ListPage } from '@/components/list/ListPage'
import { ListPageProvider } from '@/components/list/ListPageContext'
import { FiltersPopover } from '@/components/list/FiltersPopover'
import { FilterSelect } from '@/components/list/FilterSelect'
import type { ChatMessage } from '@/types/api'
import { useChatMessagesPage, ALL, READ_OPTIONS } from './useChatMessagesPage'
import { previewText } from './format'
import { ReadBadge } from './components/ReadBadge'
import { ChatFilter } from './components/ChatFilter'

export function ChatMessagesPage() {
	const {
		readState, setReadState,
		chatId, setChatId,
		activeFilterCount, clearFilters,
		chatRefs, chatsLoading,
		goToCreate,
		...listCtx
	} = useChatMessagesPage()

	const columns = useMemo<ColumnDef<ChatMessage, unknown>[]>(
		() => [
			{
				accessorKey: 'user_email',
				header: 'Author',
				meta: { sortKey: 'user_email', className: 'w-56' },
				cell: ({ getValue }) => (
					<TextTruncate>{getValue<string>()}</TextTruncate>
				),
			},
			{
				accessorKey: 'text',
				header: 'Text',
				cell: ({ row }) => (
					<span className="text-muted-foreground">
						{previewText(row.original.text) || '—'}
					</span>
				),
				meta: { sortKey: 'text', className: 'w-72 max-w-md' },
			},
			{
				id: 'files',
				header: 'Files',
				meta: { className: 'w-20' },
				cell: ({ row }) =>
					row.original.files.length ? (
						<Badge variant="outline">
							{row.original.files.length}
						</Badge>
					) : (
						<span className="text-muted-foreground">—</span>
					),
			},
			{
				accessorKey: 'is_read',
				header: 'Status',
				meta: { sortKey: 'is_read', className: 'w-32' },
				cell: ({ row }) => <ReadBadge isRead={row.original.is_read} />,
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
				title="Chat Messages"
				description="Individual messages exchanged in chats"
				actions={
					<Button onClick={goToCreate}>
						<Icon name="plus" />
						Add
					</Button>
				}
				searchPlaceholder="Search messages…"
				filters={
					<FiltersPopover
						activeCount={activeFilterCount}
						onClear={clearFilters}
					>
						<ChatFilter
							value={chatId}
							options={chatRefs}
							loading={chatsLoading}
							onChange={setChatId}
						/>
						<FilterSelect
							label="Status"
							value={readState}
							onChange={setReadState}
							options={READ_OPTIONS}
							allOption={{ value: ALL, label: 'All statuses' }}
						/>
					</FiltersPopover>
				}
				columns={columns}
				emptyMessage="No messages found"
				minWidth="900px"
			/>
		</ListPageProvider>
	)
}
