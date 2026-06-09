import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ListPage } from '@/components/list/ListPage'
import type { SharedPartner } from '@/types/api'
import { useSharedPartnersPage } from './useSharedPartnersPage'
import { formatDateTime } from './format'

export function SharedPartnersPage() {
	const {
		search,
		setSearch,
		data,
		isLoading,
		isFetching,
		pagination,
		sorting,
		goToCreate,
		openSharedPartner,
	} = useSharedPartnersPage()

	const columns = useMemo<ColumnDef<SharedPartner, unknown>[]>(
		() => [
			{
				accessorKey: 'agent_email',
				header: 'Agent',
				meta: { sortKey: 'agent_email', className: 'w-64' },
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
					<span className="text-muted-foreground">
						{formatDateTime(row.original.created_at)}
					</span>
				),
			},
		],
		[],
	)

	return (
		<ListPage
			title="Shared Partners"
			description="Curated partner lists assigned to an agent"
			actions={
				<Button onClick={goToCreate}>
					<Icon name="plus" />
					Add
				</Button>
			}
			search={search}
			onSearchChange={setSearch}
			searchPlaceholder="Search by agent email…"
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
			emptyMessage="No shared partners found"
			minWidth="600px"
			onRowClick={(s) => openSharedPartner(s.id)}
		/>
	)
}
