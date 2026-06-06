import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ListPage } from '@/components/list/ListPage'
import type { FormConfig } from '@/types/api'
import { useFormConfigsPage } from './useFormConfigsPage'

export function FormConfigsPage() {
	const {
		search,
		setSearch,
		data,
		isLoading,
		isFetching,
		pagination,
		goToCreate,
		openItem,
	} = useFormConfigsPage()

	const columns = useMemo<ColumnDef<FormConfig, unknown>[]>(
		() => [
			{ accessorKey: 'name', header: 'Name' },
			{
				accessorKey: 'slug',
				header: 'Slug',
				cell: ({ row }) => (
					<span className="text-muted-foreground">
						{row.original.slug}
					</span>
				),
			},
			{
				accessorKey: 'price',
				header: 'Price',
				cell: ({ row }) =>
					`${row.original.price} ${row.original.currency}`,
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
			title="Forms"
			description="Form configurations"
			actions={
				<Button onClick={goToCreate}>
					<Icon name="plus" />
					Add
				</Button>
			}
			search={search}
			onSearchChange={setSearch}
			searchPlaceholder="Search forms…"
			pagination={pagination}
			data={data}
			isLoading={isLoading}
			isFetching={isFetching}
			columns={columns}
			emptyMessage="No forms found"
			minWidth="820px"
			onRowClick={(r) => openItem(r.id)}
		/>
	)
}
