import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TimeAgo } from '@/components/TimeAgo'
import { ListPage } from '@/components/list/ListPage'
import { MediaThumbnail } from '@/components/media/MediaThumbnail'
import type { Property } from '@/types/api'
import { usePropertiesPage } from './usePropertiesPage'
import { formatLocation } from './format'

export function PropertiesPage() {
	const {
		search,
		setSearch,
		data,
		isLoading,
		isFetching,
		pagination,
		sorting,
		goToCreate,
		openProperty,
	} = usePropertiesPage()

	const columns = useMemo<ColumnDef<Property, unknown>[]>(
		() => [
			{
				id: 'image',
				header: '',
				cell: ({ row }) => (
					<MediaThumbnail
						url={row.original.image}
						shape="square"
						placeholderIcon="image"
						className="size-10"
						canvas
						size={128}
					/>
				),
				meta: { className: 'w-14' },
			},
			{
				accessorKey: 'address',
				header: 'Address',
				meta: { sortKey: 'address', className: 'w-64' },
			},
			{
				id: 'location',
				header: 'Location',
				meta: { className: 'w-48' },
				cell: ({ row }) =>
					formatLocation(row.original) || (
						<span className="text-muted-foreground">—</span>
					),
			},
			{
				accessorKey: 'property_type',
				header: 'Type',
				meta: { sortKey: 'property_type', className: 'w-32' },
				cell: ({ row }) =>
					row.original.property_type || (
						<span className="text-muted-foreground">—</span>
					),
			},
			{
				accessorKey: 'asking_price',
				header: 'Asking Price',
				meta: { sortKey: 'asking_price', className: 'w-32' },
				cell: ({ row }) =>
					row.original.asking_price || (
						<span className="text-muted-foreground">—</span>
					),
			},
			{
				accessorKey: 'status',
				header: 'Status',
				meta: { sortKey: 'status', className: 'w-32' },
				cell: ({ row }) =>
					row.original.status ? (
						<Badge variant="outline">{row.original.status}</Badge>
					) : (
						<span className="text-muted-foreground">—</span>
					),
			},
			{
				accessorKey: 'group_name',
				header: 'Group',
				meta: { sortKey: 'group_name', className: 'w-44' },
				cell: ({ row }) =>
					row.original.group_name || (
						<span className="text-muted-foreground">—</span>
					),
			},
			{
				accessorKey: 'created_at',
				header: 'Created At',
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
		<ListPage
			title="Properties"
			description="Browse investment properties"
			actions={
				<Button onClick={goToCreate}>
					<Icon name="plus" />
					Add
				</Button>
			}
			search={search}
			onSearchChange={setSearch}
			searchPlaceholder="Search properties…"
			pagination={pagination}
			data={data}
			isLoading={isLoading}
			isFetching={isFetching}
			columns={columns}
			sorting={{
				sortBy: sorting.sortBy,
				order: sorting.order,
				onToggle: sorting.toggle,
			}}
			emptyMessage="No properties found"
			minWidth="1000px"
			onRowClick={(p) => openProperty(p.id)}
		/>
	)
}
