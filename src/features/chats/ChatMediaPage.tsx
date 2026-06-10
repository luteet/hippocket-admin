import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { PageHeader } from '@/components/layout/PageHeader'
import { Reveal } from '@/components/Reveal'
import { TimeAgo } from '@/components/TimeAgo'
import { DataTable } from '@/components/DataTable'
import { PageSizeSelect } from '@/components/list/PageSizeSelect'
import type { ChatMedia } from '@/types/api'
import { useChatMediaPage } from './useChatMediaPage'
import { MediaFileLink } from './components/MediaFileLink'

export function ChatMediaPage() {
	const { data, isLoading, isFetching, pagination, sorting, openMedia } =
		useChatMediaPage()

	const columns = useMemo<ColumnDef<ChatMedia, unknown>[]>(
		() => [
			{
				accessorKey: 'user_email',
				header: 'Uploaded by',
				meta: { sortKey: 'user_email', className: 'w-56' },
			},
			{
				id: 'file',
				header: 'File',
				cell: ({ row }) => <MediaFileLink file={row.original.file} />,
				meta: { className: 'w-72 max-w-md' },
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
		<div>
			<Reveal index={0}>
				<PageHeader
					title="Chat Media"
					description="Files shared in chats"
				/>
			</Reveal>

			<Reveal index={1}>
				<div className="mb-4 flex justify-end">
					<PageSizeSelect
						count={pagination.count}
						onCountChange={pagination.setCount}
					/>
				</div>

				<DataTable
					columns={columns}
					data={data?.items ?? []}
					isLoading={isLoading || isFetching}
					emptyMessage="No media found"
					minWidth="700px"
					skeletonRows={pagination.count}
					sorting={{
						sortBy: sorting.sortBy,
						order: sorting.order,
						onToggle: sorting.toggle,
					}}
					onRowClick={(m) => openMedia(m.id)}
					pagination={{
						page: pagination.page,
						pageCount: pagination.pageCount(data?.total ?? 0),
						onPageChange: pagination.goTo,
					}}
				/>
			</Reveal>
		</div>
	)
}
