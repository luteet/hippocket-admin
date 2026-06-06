import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ListPage } from '@/components/list/ListPage'
import type { GroupFormPrice } from '@/types/api'
import { useGroupFormPricesPage } from './useGroupFormPricesPage'

export function GroupFormPricesPage() {
	const {
		search,
		setSearch,
		data,
		isLoading,
		isFetching,
		pagination,
		goToCreate,
		openItem,
	} = useGroupFormPricesPage()

	const columns = useMemo<ColumnDef<GroupFormPrice, unknown>[]>(
		() => [
			{ accessorKey: 'name', header: 'Name' },
			{ accessorKey: 'form_config_name', header: 'Form' },
			{ accessorKey: 'group_name', header: 'Group' },
			{
				accessorKey: 'price',
				header: 'Price',
				cell: ({ row }) => row.original.price,
			},
			{
				accessorKey: 'is_active',
				header: 'Active',
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
				cell: ({ row }) => (
					<span className="text-muted-foreground">
						{row.original.created_at.slice(0, 16)}
					</span>
				),
			},
		],
		[],
	)

	return (
		<ListPage
			title="Form Prices"
			description="Per-group form pricing"
			actions={
				<Button onClick={goToCreate}>
					<Icon name="plus" />
					Add
				</Button>
			}
			search={search}
			onSearchChange={setSearch}
			searchPlaceholder="Search prices…"
			pagination={pagination}
			data={data}
			isLoading={isLoading}
			isFetching={isFetching}
			columns={columns}
			emptyMessage="No form prices found"
			minWidth="900px"
			onRowClick={(r) => openItem(r.id)}
		/>
	)
}
