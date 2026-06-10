import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TimeAgo } from '@/components/TimeAgo'
import { ListPage } from '@/components/list/ListPage'
import { FiltersPopover } from '@/components/list/FiltersPopover'
import { FilterSelect } from '@/components/list/FilterSelect'
import type { CashOffersEmail } from '@/types/api'
import {
	useCashOffersEmailsPage,
	ALL,
	ACTIVE_OPTIONS,
} from './useCashOffersEmailsPage'

export function CashOffersEmailsPage() {
	const {
		search,
		setSearch,
		group,
		setGroup,
		isActive,
		setIsActive,
		groupOptions,
		activeFilterCount,
		clearFilters,
		data,
		isLoading,
		isFetching,
		pagination,
		sorting,
		goToCreate,
		openEmail,
	} = useCashOffersEmailsPage()

	const columns = useMemo<ColumnDef<CashOffersEmail, unknown>[]>(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
				meta: { sortKey: 'name', className: 'w-48' },
			},
			{
				accessorKey: 'email',
				header: 'Email',
				meta: { sortKey: 'email', className: 'w-64' },
			},
			{
				accessorKey: 'group_name',
				header: 'Group',
				meta: { sortKey: 'group_name', className: 'w-44' },
				cell: ({ row }) =>
					row.original.group_name || (
						<span className="text-muted-foreground">
							All properties
						</span>
					),
			},
			{
				accessorKey: 'is_active',
				header: 'Status',
				meta: { sortKey: 'is_active', className: 'w-32' },
				cell: ({ row }) =>
					row.original.is_active ? (
						<Badge variant="success">Active</Badge>
					) : (
						<Badge variant="muted">Inactive</Badge>
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
		<ListPage
			title="Cash Offers Emails"
			description="Recipients of cash-offer emails"
			actions={
				<Button onClick={goToCreate}>
					<Icon name="plus" />
					Add
				</Button>
			}
			search={search}
			onSearchChange={setSearch}
			searchPlaceholder="Search emails…"
			filters={
				<FiltersPopover
					activeCount={activeFilterCount}
					onClear={clearFilters}
				>
					<FilterSelect
						label="Group"
						value={group}
						onChange={setGroup}
						options={groupOptions.map((g) => ({
							value: String(g.id),
							label: g.name,
						}))}
						allOption={{ value: ALL, label: 'All groups' }}
					/>
					<FilterSelect
						label="Status"
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
			sorting={{
				sortBy: sorting.sortBy,
				order: sorting.order,
				onToggle: sorting.toggle,
			}}
			emptyMessage="No emails found"
			minWidth="900px"
			onRowClick={(e) => openEmail(e.id)}
		/>
	)
}
