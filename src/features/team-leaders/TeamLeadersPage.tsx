import { useMemo } from 'react'
import { Link } from 'react-router'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { ListPage } from '@/components/list/ListPage'
import { FiltersPopover } from '@/components/list/FiltersPopover'
import { FilterSelect } from '@/components/list/FilterSelect'
import type { TeamLeader } from '@/types/api'
import { useTeamLeadersPage, ALL } from './useTeamLeadersPage'
import { formatDateTime } from './format'

export function TeamLeadersPage() {
	const {
		search,
		setSearch,
		groupId,
		setGroupId,
		groupOptions,
		activeFilterCount,
		clearFilters,
		data,
		isLoading,
		isFetching,
		pagination,
		openTeamLeader,
		goToCreate,
	} = useTeamLeadersPage()

	const columns = useMemo<ColumnDef<TeamLeader, unknown>[]>(
		() => [
			{
				accessorKey: 'tl_name',
				header: 'Name',
				cell: ({ row }) => (
					<span className="font-medium">{row.original.tl_name}</span>
				),
			},
			{ accessorKey: 'tl_email', header: 'Email' },
			{
				accessorKey: 'tl_phone',
				header: 'Phone',
				cell: ({ row }) => (
					<span className="whitespace-nowrap">
						{row.original.tl_phone}
					</span>
				),
			},
			{
				accessorKey: 'group_name',
				header: 'Group',
				cell: ({ row }) => {
					const { group_id, group_name } = row.original
					return (
						<Link
							to={`/groups/${group_id}`}
							className="text-primary underline underline-offset-[5px] transition-[filter] hover:brightness-110 active:brightness-90"
							onClick={(e) => e.stopPropagation()}
						>
							{group_name}
						</Link>
					)
				},
			},
			{
				accessorKey: 'office_location',
				header: 'Office',
				cell: ({ row }) =>
					row.original.office_location || (
						<span className="text-muted-foreground">—</span>
					),
			},
			{
				accessorKey: 'created_at',
				header: 'Created At',
				cell: ({ row }) => (
					<span className="whitespace-nowrap text-muted-foreground">
						{formatDateTime(row.original.created_at)}
					</span>
				),
			},
		],
		[],
	)

	return (
		<ListPage
			title="Team Leaders"
			description="Group team leaders and their office locations"
			actions={
				<Button onClick={goToCreate}>
					<Icon name="plus" />
					Add
				</Button>
			}
			search={search}
			onSearchChange={setSearch}
			searchPlaceholder="Search by name, email or office…"
			filters={
				<FiltersPopover
					activeCount={activeFilterCount}
					onClear={clearFilters}
				>
					<FilterSelect
						label="Group"
						value={groupId}
						onChange={setGroupId}
						options={groupOptions.map((g) => ({
							value: String(g.id),
							label: g.name,
						}))}
						allOption={{ value: ALL, label: 'All groups' }}
					/>
				</FiltersPopover>
			}
			pagination={pagination}
			data={data}
			isLoading={isLoading}
			isFetching={isFetching}
			columns={columns}
			emptyMessage="No team leaders found"
			minWidth="1000px"
			onRowClick={(t) => openTeamLeader(t.id)}
		/>
	)
}
