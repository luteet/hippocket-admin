import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { TextTruncate } from '@/components/TextTruncate'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TimeAgo } from '@/components/TimeAgo'
import { ListPage } from '@/components/list/ListPage'
import { ListPageProvider } from '@/components/list/ListPageContext'
import type { SharedPartner } from '@/types/api'
import { useSharedPartnersPage } from './useSharedPartnersPage'

export function SharedPartnersPage() {
	const {
		goToCreate,
		...listCtx
	} = useSharedPartnersPage()

	const columns = useMemo<ColumnDef<SharedPartner, unknown>[]>(
		() => [
			{
				accessorKey: 'agent_email',
				header: 'Agent',
				meta: { sortKey: 'agent_email', className: 'w-64' },
				cell: ({ getValue }) => (
					<TextTruncate>{getValue<string>()}</TextTruncate>
				),
			},
			{
				id: 'entries',
				header: 'Partners',
				meta: { className: 'w-28' },
				cell: ({ row }) => (
					<Badge variant="outline">
						{row.original.entries.length}
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
				title="Shared Partners"
				description="Curated partner lists assigned to an agent"
				actions={
					<Button onClick={goToCreate}>
						<Icon name="plus" />
						Add
					</Button>
				}
				searchPlaceholder="Search by agent email…"
				columns={columns}
				emptyMessage="No shared partners found"
				minWidth="600px"
			/>
		</ListPageProvider>
	)
}
