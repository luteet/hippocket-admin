import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { ListPage } from '@/components/list/ListPage'
import { ListPageProvider } from '@/components/list/ListPageContext'
import type { Status } from '@/types/api'
import { useStatusesPage } from './useStatusesPage'

export function StatusesPage() {
	const {
		reorder,
		goToCreate,
		...listCtx
	} = useStatusesPage()

	const columns = useMemo<ColumnDef<Status, unknown>[]>(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
				meta: { sortKey: 'name', className: 'w-56' },
			},
			{
				accessorKey: 'label',
				header: 'Label',
				meta: { sortKey: 'label', className: 'w-48' },
				cell: ({ row }) => (
					<span className="text-muted-foreground">
						{row.original.label}
					</span>
				),
			},
		],
		[],
	)

	return (
		<ListPageProvider value={listCtx}>
			<ListPage
				title="Statuses"
				description="Browse referral pipeline statuses"
				actions={
					<Button onClick={goToCreate}>
						<Icon name="plus" />
						Add
					</Button>
				}
				searchPlaceholder="Search statuses…"
				columns={columns}
				reorder={reorder}
				emptyMessage="No statuses found"
				minWidth="320px"
			/>
		</ListPageProvider>
	)
}
