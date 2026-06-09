import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ListPage } from '@/components/list/ListPage'
import { FiltersPopover } from '@/components/list/FiltersPopover'
import { FilterSelect } from '@/components/list/FilterSelect'
import type { ChatMessage } from '@/types/api'
import { useChatMessagesPage, ALL, READ_OPTIONS } from './useChatMessagesPage'
import { formatDateTime, previewText } from './format'
import { ReadBadge } from './components/ReadBadge'
import { ChatFilter } from './components/ChatFilter'

export function ChatMessagesPage() {
	const {
		search,
		setSearch,
		readState,
		setReadState,
		chatId,
		setChatId,
		activeFilterCount,
		clearFilters,
		chatRefs,
		chatsLoading,
		data,
		isLoading,
		isFetching,
		pagination,
		sorting,
		goToCreate,
		openMessage,
	} = useChatMessagesPage()

	const columns = useMemo<ColumnDef<ChatMessage, unknown>[]>(
		() => [
			{
				accessorKey: 'user_email',
				header: 'Author',
				meta: { sortKey: 'user_email', className: 'w-56' },
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
			title="Chat Messages"
			description="Individual messages exchanged in chats"
			actions={
				<Button onClick={goToCreate}>
					<Icon name="plus" />
					Add
				</Button>
			}
			search={search}
			onSearchChange={setSearch}
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
			emptyMessage="No messages found"
			minWidth="900px"
			onRowClick={(m) => openMessage(m.id)}
		/>
	)
}
