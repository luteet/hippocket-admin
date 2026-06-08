import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/DataTable'
import { PageSizeSelect } from '@/components/list/PageSizeSelect'
import type { ChatMessage } from '@/types/api'
import { useChatMessagesTab } from './useChatMessagesTab'
import { formatDateTime, previewText } from './format'
import { ReadBadge } from './components/ReadBadge'

interface Props {
	chatId: string
}

export function ChatMessagesTab({ chatId }: Props) {
	const { data, isLoading, isFetching, pagination, openMessage, goToCreate } =
		useChatMessagesTab(chatId)

	const columns = useMemo<ColumnDef<ChatMessage, unknown>[]>(
		() => [
			{ accessorKey: 'user_email', header: 'Author' },
			{
				accessorKey: 'text',
				header: 'Text',
				cell: ({ row }) => (
					<span className="text-muted-foreground">
						{previewText(row.original.text) || '—'}
					</span>
				),
				meta: { className: 'max-w-md' },
			},
			{
				id: 'files',
				header: 'Files',
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
				cell: ({ row }) => <ReadBadge isRead={row.original.is_read} />,
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
		<div className="space-y-4">
			<div className="flex items-center justify-between gap-3">
				<PageSizeSelect
					count={pagination.count}
					onCountChange={pagination.setCount}
				/>
				<Button onClick={goToCreate}>
					<Icon name="plus" />
					Add
				</Button>
			</div>

			<DataTable
				columns={columns}
				data={data?.items ?? []}
				isLoading={isLoading || isFetching}
				emptyMessage="No messages in this chat"
				minWidth="800px"
				skeletonRows={pagination.count}
				onRowClick={(m) => openMessage(m.id)}
				pagination={{
					page: pagination.page,
					pageCount: pagination.pageCount(data?.total ?? 0),
					onPageChange: pagination.goTo,
				}}
			/>
		</div>
	)
}
