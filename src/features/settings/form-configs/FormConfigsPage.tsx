import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TimeAgo } from '@/components/TimeAgo'
import { ListPage } from '@/components/list/ListPage'
import { ListPageProvider } from '@/components/list/ListPageContext'
import type { FormConfig } from '@/types/api'
import { useFormConfigsPage } from './useFormConfigsPage'

export function FormConfigsPage() {
	const {
		goToCreate,
		...listCtx
	} = useFormConfigsPage()

	const columns = useMemo<ColumnDef<FormConfig, unknown>[]>(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
				meta: { sortKey: 'name', className: 'w-52' },
			},
			{
				accessorKey: 'slug',
				header: 'Slug',
				meta: { sortKey: 'slug', className: 'w-44' },
				cell: ({ row }) => (
					<span className="text-muted-foreground">
						{row.original.slug}
					</span>
				),
			},
			{
				accessorKey: 'price',
				header: 'Price',
				meta: { sortKey: 'price', className: 'w-32' },
				cell: ({ row }) =>
					`${row.original.price} ${row.original.currency}`,
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
				title="Forms"
				description="Form configurations"
				actions={
					<Button onClick={goToCreate}>
						<Icon name="plus" />
						Add
					</Button>
				}
				searchPlaceholder="Search forms…"
				columns={columns}
				emptyMessage="No forms found"
				minWidth="820px"
			/>
		</ListPageProvider>
	)
}
