import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { PageHeader } from '@/components/layout/PageHeader'
import { Reveal } from '@/components/Reveal'
import { DataTable } from '@/components/DataTable'
import { PageSizeSelect } from '@/components/list/PageSizeSelect'
import { Icon } from '@/components/Icon'
import { resolveMediaUrl } from '@/lib/media'
import type { PropertyImage } from '@/types/api'
import { usePropertyImagesPage } from './usePropertyImagesPage'
import { MediaThumbnail } from '@/components/media/MediaThumbnail'

export function PropertyImagesPage() {
	const { data, isLoading, isFetching, pagination, sorting, openImage } =
		usePropertyImagesPage()

	const columns = useMemo<ColumnDef<PropertyImage, unknown>[]>(
		() => [
			{
				id: 'preview',
				header: '',
				cell: ({ row }) => {
					const src = resolveMediaUrl(
						row.original.image_thumbnail || row.original.image,
					)
					return (
						<div className="flex size-12 items-center justify-center overflow-hidden rounded-md border border-border bg-muted text-muted-foreground">
							{src ? (
								<MediaThumbnail
									url={src}
									className="size-full object-cover"
									canvas
									size={256}
								/>
							) : (
								<Icon name="image" className="size-5" />
							)}
						</div>
					)
				},
				meta: { className: 'w-16' },
			},
			{
				accessorKey: 'property_address',
				header: 'Property',
				meta: { sortKey: 'property_address', className: 'w-72' },
				cell: ({ row }) =>
					row.original.property_address || (
						<span className="text-muted-foreground">Unlinked</span>
					),
			},
			{
				accessorKey: 'sort',
				header: 'Sort',
				meta: { sortKey: 'sort', className: 'w-28' },
				cell: ({ row }) => (
					<span className="text-muted-foreground">
						{row.original.sort}
					</span>
				),
			},
		],
		[],
	)

	return (
		<div>
			<Reveal index={0}>
				<PageHeader
					title="Property Images"
					description="Property gallery images (uploaded from the app)"
				/>
			</Reveal>

			<Reveal index={1}>
				<div className="mb-4 flex justify-end">
					<PageSizeSelect
						count={pagination.count}
						onCountChange={pagination.setCount}
					/>
				</div>

				<DataTable
					columns={columns}
					data={data?.items ?? []}
					isLoading={isLoading || isFetching}
					emptyMessage="No images found"
					minWidth="700px"
					skeletonRows={pagination.count}
					onRowClick={(img) => openImage(img.id)}
					sorting={{
						sortBy: sorting.sortBy,
						order: sorting.order,
						onToggle: sorting.toggle,
					}}
					pagination={{
						page: pagination.page,
						pageCount: pagination.pageCount(data?.total ?? 0),
						onPageChange: pagination.goTo,
					}}
				/>
			</Reveal>
		</div>
	)
}
