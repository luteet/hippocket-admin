import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { ListPage } from '@/components/list/ListPage'
import type { LinkName } from '@/types/api'
import { useLinkNamesPage } from './useLinkNamesPage'

export function LinkNamesPage() {
	const {
		search,
		setSearch,
		data,
		isLoading,
		isFetching,
		pagination,
		goToCreate,
		openItem,
	} = useLinkNamesPage()

	const columns = useMemo<ColumnDef<LinkName, unknown>[]>(
		() => [
			{ accessorKey: 'name', header: 'Name' },
			{
				accessorKey: 'link',
				header: 'Link',
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
			title="Links"
			description="Named external links"
			actions={
				<Button onClick={goToCreate}>
					<Icon name="plus" />
					Add
				</Button>
			}
			search={search}
			onSearchChange={setSearch}
			searchPlaceholder="Search links…"
			pagination={pagination}
			data={data}
			isLoading={isLoading}
			isFetching={isFetching}
			columns={columns}
			emptyMessage="No links found"
			minWidth="640px"
			onRowClick={(r) => openItem(r.id)}
		/>
	)
}
