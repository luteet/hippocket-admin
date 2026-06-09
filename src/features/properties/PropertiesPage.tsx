import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
			{ accessorKey: 'address', header: 'Address' },
			{
				id: 'location',
				header: 'Location',
				cell: ({ row }) =>
					formatLocation(row.original) || (
						<span className="text-muted-foreground">—</span>
					),
			},
			{
				accessorKey: 'property_type',
				header: 'Type',
				cell: ({ row }) =>
					row.original.property_type || (
						<span className="text-muted-foreground">—</span>
					),
			},
			{
				accessorKey: 'asking_price',
				header: 'Asking Price',
				cell: ({ row }) =>
					row.original.asking_price || (
						<span className="text-muted-foreground">—</span>
					),
			},
			{
				accessorKey: 'status',
				header: 'Status',
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
				cell: ({ row }) =>
					row.original.group_name || (
						<span className="text-muted-foreground">—</span>
					),
			},
			{
				accessorKey: 'created_at',
				header: 'Created At',
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
			emptyMessage="No properties found"
			minWidth="1000px"
			onRowClick={(p) => openProperty(p.id)}
		/>
	)
}
