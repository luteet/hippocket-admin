import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { ListPage } from '@/components/list/ListPage'
import type { Status } from '@/types/api'
import { useStatusesPage } from './useStatusesPage'

export function StatusesPage() {
	const {
		search,
		setSearch,
		data,
		isLoading,
		isFetching,
		pagination,
		goToCreate,
		openStatus,
	} = useStatusesPage()

	const columns = useMemo<ColumnDef<Status, unknown>[]>(
		() => [
			{ accessorKey: 'name', header: 'Name' },
			{
				accessorKey: 'label',
				header: 'Label',
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
		<ListPage
			title="Statuses"
			description="Browse referral pipeline statuses"
			actions={
				<Button onClick={goToCreate}>
					<Icon name="plus" />
					Add
				</Button>
			}
			search={search}
			onSearchChange={setSearch}
			searchPlaceholder="Search statuses…"
			pagination={pagination}
			data={data}
			isLoading={isLoading}
			isFetching={isFetching}
			columns={columns}
			emptyMessage="No statuses found"
			minWidth="320px"
			onRowClick={(s) => openStatus(s.id)}
		/>
	)
}
