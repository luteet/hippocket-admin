import { useMemo } from 'react'
import { Link } from 'react-router'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { TextTruncate } from '@/components/TextTruncate'
import { Button } from '@/components/ui/button'
import { TimeAgo } from '@/components/TimeAgo'
import { ListPage } from '@/components/list/ListPage'
import { ListPageProvider } from '@/components/list/ListPageContext'
import type { SavedFilter } from '@/types/api'
import { useSavedFiltersPage } from './useSavedFiltersPage'
import { savedFilterTitle } from './format'

export function SavedFiltersPage() {
	const {
		goToCreate,
		...listCtx
	} = useSavedFiltersPage()

	const columns = useMemo<ColumnDef<SavedFilter, unknown>[]>(
		() => [
			{
				accessorKey: 'title',
				header: 'Title',
				meta: { sortKey: 'title', className: 'w-56' },
				cell: ({ row }) => (
					<span className="font-medium">
						{savedFilterTitle(row.original.title)}
					</span>
				),
			},
			{
				accessorKey: 'user_email',
				header: 'Agent',
				meta: { sortKey: 'user_email', className: 'w-64' },
				cell: ({ row }) => {
					const { user_id, user_email } = row.original
					return (
						<Link
							to={`/agents/${user_id}`}
							className="link"
							onClick={(e) => e.stopPropagation()}
						>
							<TextTruncate>{user_email}</TextTruncate>
						</Link>
					)
				},
			},
			{
				accessorKey: 'value',
				header: 'Value',
				meta: { className: 'w-72' },
				cell: ({ row }) => (
					<span className="block max-w-md truncate font-mono text-xs text-muted-foreground">
						{row.original.value}
					</span>
				),
			},
			{
				accessorKey: 'created_at',
				header: 'Created At',
				meta: { sortKey: 'created_at', className: 'w-40' },
				cell: ({ row }) => (
					<TimeAgo
						value={row.original.created_at}
						className="whitespace-nowrap text-muted-foreground"
					/>
				),
			},
		],
		[],
	)

	return (
		<ListPageProvider value={listCtx}>
			<ListPage
				title="Saved Filters"
				description="Agents' saved property searches"
				actions={
					<Button onClick={goToCreate}>
						<Icon name="plus" />
						Add
					</Button>
				}
				searchPlaceholder="Search by title or agent…"
				columns={columns}
				emptyMessage="No saved filters found"
				minWidth="900px"
			/>
		</ListPageProvider>
	)
}
