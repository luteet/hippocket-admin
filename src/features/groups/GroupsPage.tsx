import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TimeAgo } from '@/components/TimeAgo'
import { ListPage } from '@/components/list/ListPage'
import { FiltersPopover } from '@/components/list/FiltersPopover'
import { FilterSelect } from '@/components/list/FilterSelect'
import type { Group } from '@/types/api'
import { useGroupsPage, DELETED_OPTIONS } from './useGroupsPage'

export function GroupsPage() {
	const {
		search,
		setSearch,
		deleted,
		setDeleted,
		activeFilterCount,
		clearFilters,
		data,
		isLoading,
		isFetching,
		pagination,
		sorting,
		goToCreate,
		openGroup,
	} = useGroupsPage()

	const columns = useMemo<ColumnDef<Group, unknown>[]>(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
				meta: { sortKey: 'name', className: 'w-56' },
			},
			{
				accessorKey: 'slug',
				header: 'Slug',
				meta: { sortKey: 'slug', className: 'w-48' },
				cell: ({ row }) => (
					<span className="text-muted-foreground">
						{row.original.slug}
					</span>
				),
			},
			{
				accessorKey: 'count_people',
				header: 'People',
				meta: { sortKey: 'count_people', className: 'w-28' },
				cell: ({ row }) => (
					<span className="tabular-nums">
						{row.original.count_people}
					</span>
				),
			},
			{
				accessorKey: 'is_deleted',
				header: 'Status',
				meta: { sortKey: 'is_deleted', className: 'w-32' },
				cell: ({ row }) =>
					row.original.is_deleted ? (
						<Badge variant="destructive">Deleted</Badge>
					) : (
						<Badge variant="success">Active</Badge>
					),
			},
			{
				accessorKey: 'deleted_at',
				header: 'Deleted At',
				meta: { sortKey: 'deleted_at', className: 'w-40' },
				cell: ({ row }) => (
					<TimeAgo
						value={row.original.deleted_at}
						className="text-muted-foreground"
					/>
				),
			},
		],
		[],
	)

	return (
		<ListPage
			title="Groups"
			description="Browse partner groups"
			actions={
				<Button onClick={goToCreate}>
					<Icon name="plus" />
					Add
				</Button>
			}
			search={search}
			onSearchChange={setSearch}
			searchPlaceholder="Search groups…"
			filters={
				<FiltersPopover
					activeCount={activeFilterCount}
					onClear={clearFilters}
				>
					<FilterSelect
						label="Status"
						value={deleted}
						onChange={setDeleted}
						options={DELETED_OPTIONS}
					/>
				</FiltersPopover>
			}
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
			emptyMessage="No groups found"
			minWidth="600px"
			onRowClick={(g) => openGroup(g.id)}
		/>
	)
}
