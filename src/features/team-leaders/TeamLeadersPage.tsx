import { useMemo } from 'react'
import { Link } from 'react-router'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { TextTruncate } from '@/components/TextTruncate'
import { Button } from '@/components/ui/button'
import { TimeAgo } from '@/components/TimeAgo'
import { ListPage } from '@/components/list/ListPage'
import { ListPageProvider } from '@/components/list/ListPageContext'
import { FiltersPopover } from '@/components/list/FiltersPopover'
import { FilterSelect } from '@/components/list/FilterSelect'
import type { TeamLeader } from '@/types/api'
import { useTeamLeadersPage, ALL } from './useTeamLeadersPage'

export function TeamLeadersPage() {
	const {
		groupId, setGroupId,
		groupOptions,
		activeFilterCount, clearFilters,
		goToCreate,
		...listCtx
	} = useTeamLeadersPage()

	const columns = useMemo<ColumnDef<TeamLeader, unknown>[]>(
		() => [
			{
				accessorKey: 'tl_name',
				header: 'Name',
				meta: { sortKey: 'tl_name', className: 'w-48' },
				cell: ({ row }) => (
					<span className="font-medium">{row.original.tl_name}</span>
				),
			},
			{
				accessorKey: 'tl_email',
				header: 'Email',
				meta: { sortKey: 'tl_email', className: 'w-64' },
				cell: ({ getValue }) => (
					<TextTruncate>{getValue<string>()}</TextTruncate>
				),
			},
			{
				accessorKey: 'tl_phone',
				header: 'Phone',
				meta: { sortKey: 'tl_phone', className: 'w-40' },
				cell: ({ row }) => (
					<span className="whitespace-nowrap">
						{row.original.tl_phone}
					</span>
				),
			},
			{
				accessorKey: 'group_name',
				header: 'Group',
				meta: { sortKey: 'group_name', className: 'w-48' },
				cell: ({ row }) => {
					const { group_id, group_name } = row.original
					return (
						<Link
							to={`/groups/${group_id}`}
							className="link"
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
				meta: { sortKey: 'office_location', className: 'w-40' },
				cell: ({ row }) =>
					row.original.office_location || (
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
						className="whitespace-nowrap text-muted-foreground"
					/>
				),
			},
		],
		[],
	)

	return (
		<ListPageProvider value={listCtx}>
			<ListPage
				title="Team Leaders"
				description="Group team leaders and their office locations"
				actions={
					<Button onClick={goToCreate}>
						<Icon name="plus" />
						Add
					</Button>
				}
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
				columns={columns}
				emptyMessage="No team leaders found"
				minWidth="1000px"
			/>
		</ListPageProvider>
	)
}
