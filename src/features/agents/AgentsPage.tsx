import { useMemo } from 'react'
import { Link } from 'react-router'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { TextTruncate } from '@/components/TextTruncate'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TimeAgo } from '@/components/TimeAgo'
import { ListPage } from '@/components/list/ListPage'
import { ListPageProvider } from '@/components/list/ListPageContext'
import { FiltersPopover } from '@/components/list/FiltersPopover'
import { FilterSelect } from '@/components/list/FilterSelect'
import type { Agent } from '@/types/api'
import {
	useAgentsPage,
	ALL,
	ROLE_OPTIONS,
	STATUS_OPTIONS,
	ACTIVE_OPTIONS,
} from './useAgentsPage'

export function AgentsPage() {
	const {
		role, setRole,
		status, setStatus,
		isActive, setIsActive,
		activeFilterCount, clearFilters,
		goToCreate,
		...listCtx
	} = useAgentsPage()

	const columns = useMemo<ColumnDef<Agent, unknown>[]>(
		() => [
			{
				accessorKey: 'email',
				header: 'Email',
				meta: { sortKey: 'email', className: 'w-64' },
				cell: ({ getValue }) => (
					<TextTruncate>{getValue<string>()}</TextTruncate>
				),
			},
			{
				accessorKey: 'username',
				header: 'Username',
				meta: { sortKey: 'username', className: 'w-48' },
				cell: ({ row }) =>
					row.original.username || (
						<span className="text-muted-foreground">—</span>
					),
			},
			{
				accessorKey: 'role',
				header: 'Role',
				meta: { sortKey: 'role', className: 'w-32' },
				cell: ({ row }) => (
					<Badge variant="outline" className="capitalize">
						{row.original.role}
					</Badge>
				),
			},
			{
				id: 'groups',
				header: 'Groups',
				meta: { className: 'w-56' },
				cell: ({ row }) => {
					const { group_ids, group_names } = row.original
					if (!group_ids?.length)
						return <span className="text-muted-foreground">—</span>
					return (
						<div className="flex flex-wrap gap-1">
							{group_ids.map((id, i) => (
								<Link
									key={id}
									to={`/groups/${id}`}
									onClick={(e) => e.stopPropagation()}
								>
									<Badge
										variant="outline"
										className="hover:border-primary"
									>
										{group_names[i] ?? id}
									</Badge>
								</Link>
							))}
						</div>
					)
				},
			},
			{
				accessorKey: 'is_new_user',
				header: 'New User',
				meta: { sortKey: 'is_new_user', className: 'w-28' },
				cell: ({ row }) =>
					row.original.is_new_user ? (
						<Icon
							name="circle-check"
							className="size-5 text-emerald-600"
						/>
					) : (
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
		<ListPageProvider value={listCtx}>
			<ListPage
				title="Agents"
				description="Browse registered agents"
				actions={
					<Button onClick={goToCreate}>
						<Icon name="plus" />
						Add
					</Button>
				}
				searchPlaceholder="Search agents…"
				filters={
					<FiltersPopover
						activeCount={activeFilterCount}
						onClear={clearFilters}
					>
						<FilterSelect
							label="Role"
							value={role}
							onChange={setRole}
							options={ROLE_OPTIONS}
							allOption={{ value: ALL, label: 'All roles' }}
						/>
						<FilterSelect
							label="Status"
							value={status}
							onChange={setStatus}
							options={STATUS_OPTIONS}
							allOption={{ value: ALL, label: 'All statuses' }}
						/>
						<FilterSelect
							label="Active"
							value={isActive}
							onChange={setIsActive}
							options={ACTIVE_OPTIONS}
						/>
					</FiltersPopover>
				}
				columns={columns}
				emptyMessage="No agents found"
				minWidth="1000px"
			/>
		</ListPageProvider>
	)
}
