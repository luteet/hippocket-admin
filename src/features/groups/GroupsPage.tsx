import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ListPage } from '@/components/list/ListPage'
import { FiltersPopover } from '@/components/list/FiltersPopover'
import { FilterSelect } from '@/components/list/FilterSelect'
import { formatDateTime } from '@/lib/format'
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
		goToCreate,
		openGroup,
	} = useGroupsPage()

	const columns = useMemo<ColumnDef<Group, unknown>[]>(
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
				accessorKey: 'count_people',
				header: 'People',
				cell: ({ row }) => (
					<span className="tabular-nums">
						{row.original.count_people}
					</span>
				),
			},
			{
				accessorKey: 'is_deleted',
				header: 'Status',
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
				cell: ({ row }) => (
					<span className="text-muted-foreground">
						{formatDateTime(row.original.deleted_at)}
					</span>
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
			emptyMessage="No groups found"
			minWidth="600px"
			onRowClick={(g) => openGroup(g.id)}
		/>
	)
}
