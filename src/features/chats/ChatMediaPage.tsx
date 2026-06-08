import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { PageHeader } from '@/components/layout/PageHeader'
import { Reveal } from '@/components/Reveal'
import { DataTable } from '@/components/DataTable'
import { PageSizeSelect } from '@/components/list/PageSizeSelect'
import type { ChatMedia } from '@/types/api'
import { useChatMediaPage } from './useChatMediaPage'
import { formatDateTime } from './format'
import { MediaFileLink } from './components/MediaFileLink'

export function ChatMediaPage() {
	const { data, isLoading, isFetching, pagination, openMedia } =
		useChatMediaPage()

	const columns = useMemo<ColumnDef<ChatMedia, unknown>[]>(
		() => [
			{ accessorKey: 'user_email', header: 'Uploaded by' },
			{
				id: 'file',
				header: 'File',
				cell: ({ row }) => <MediaFileLink file={row.original.file} />,
				meta: { className: 'max-w-md' },
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
