import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { TimeAgo } from '@/components/TimeAgo'
import { ListPage } from '@/components/list/ListPage'
import { ListPageProvider } from '@/components/list/ListPageContext'
import type { LinkName } from '@/types/api'
import { useLinkNamesPage } from './useLinkNamesPage'

export function LinkNamesPage() {
	const {
		goToCreate,
		...listCtx
	} = useLinkNamesPage()

	const columns = useMemo<ColumnDef<LinkName, unknown>[]>(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
				meta: { sortKey: 'name', className: 'w-48' },
			},
			{
				accessorKey: 'link',
				header: 'Link',
				meta: { sortKey: 'link', className: 'w-72' },
				// Long URLs have no spaces to wrap on — cap the width and break
				// per-character so they don't stretch the column.
				cell: ({ row }) => (
					<span className="block max-w-xs break-all text-muted-foreground">
						{row.original.link}
					</span>
				),
			},
			{
				accessorKey: 'created_at',
				header: 'Created at',
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
				title="Links"
				description="Named external links"
				actions={
					<Button onClick={goToCreate}>
						<Icon name="plus" />
						Add
					</Button>
				}
				searchPlaceholder="Search links…"
				columns={columns}
				emptyMessage="No links found"
				minWidth="640px"
			/>
		</ListPageProvider>
	)
}
