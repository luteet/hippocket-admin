import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TimeAgo } from '@/components/TimeAgo'
import { ListPage } from '@/components/list/ListPage'
import { ListPageProvider } from '@/components/list/ListPageContext'
import type { GroupFormPrice } from '@/types/api'
import { useGroupFormPricesPage } from './useGroupFormPricesPage'

export function GroupFormPricesPage() {
	const {
		goToCreate,
		...listCtx
	} = useGroupFormPricesPage()

	const columns = useMemo<ColumnDef<GroupFormPrice, unknown>[]>(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
				meta: { sortKey: 'name', className: 'w-48' },
			},
			{
				accessorKey: 'form_config_name',
				header: 'Form',
				meta: { sortKey: 'form_config_name', className: 'w-48' },
			},
			{
				accessorKey: 'group_name',
				header: 'Group',
				meta: { sortKey: 'group_name', className: 'w-44' },
			},
			{
				accessorKey: 'price',
				header: 'Price',
				meta: { sortKey: 'price', className: 'w-32' },
				cell: ({ row }) => row.original.price,
			},
			{
				accessorKey: 'is_active',
				header: 'Active',
				meta: { sortKey: 'is_active', className: 'w-28' },
				cell: ({ row }) => (
					<Badge
						variant={row.original.is_active ? 'success' : 'muted'}
					>
						{row.original.is_active ? 'Active' : 'Inactive'}
					</Badge>
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
				title="Form Prices"
				description="Per-group form pricing"
				actions={
					<Button onClick={goToCreate}>
						<Icon name="plus" />
						Add
					</Button>
				}
				searchPlaceholder="Search prices…"
				columns={columns}
				emptyMessage="No form prices found"
				minWidth="900px"
			/>
		</ListPageProvider>
	)
}
