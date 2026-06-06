import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ListPage } from '@/components/list/ListPage'
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
		search,
		setSearch,
		role,
		setRole,
		status,
		setStatus,
		isActive,
		setIsActive,
		activeFilterCount,
		clearFilters,
		data,
		isLoading,
		isFetching,
		pagination,
		goToCreate,
		openAgent,
	} = useAgentsPage()

	const columns = useMemo<ColumnDef<Agent, unknown>[]>(
		() => [
			{ accessorKey: 'email', header: 'Email' },
			{
				accessorKey: 'username',
				header: 'Username',
				cell: ({ row }) =>
					row.original.username || (
						<span className="text-muted-foreground">—</span>
					),
			},
			{
				accessorKey: 'role',
				header: 'Role',
				cell: ({ row }) => (
					<Badge variant="outline" className="capitalize">
						{row.original.role}
					</Badge>
				),
			},
			{
				id: 'groups',
				header: 'Groups',
				cell: ({ row }) => {
					const groups = row.original.group_names
					if (!groups?.length)
						return <span className="text-muted-foreground">—</span>
					return (
						<div className="flex flex-wrap gap-1">
							{groups.map((g) => (
								<Badge key={g} variant="outline">
									{g}
								</Badge>
							))}
						</div>
					)
				},
			},
			{
				accessorKey: 'is_new_user',
				header: 'New User',
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
			title="Agents"
			description="Browse registered agents"
			actions={
				<Button onClick={goToCreate}>
					<Icon name="plus" />
					Add
				</Button>
			}
			search={search}
			onSearchChange={setSearch}
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
			pagination={pagination}
			data={data}
			isLoading={isLoading}
			isFetching={isFetching}
			columns={columns}
			emptyMessage="No agents found"
			minWidth="1000px"
			onRowClick={(a) => openAgent(a.id)}
		/>
	)
}
