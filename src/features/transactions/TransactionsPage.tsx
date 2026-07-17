import { useMemo } from 'react'
import { Link } from 'react-router'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TextTruncate } from '@/components/TextTruncate'
import { TimeAgo } from '@/components/TimeAgo'
import { ListPage } from '@/components/list/ListPage'
import { FiltersPopover } from '@/components/list/FiltersPopover'
import { FilterSelect } from '@/components/list/FilterSelect'
import { FilterDate } from '@/components/list/FilterDate'
import type { Transaction } from '@/types/api'
import { capitalize } from './format'
import { useTransactionsPage, ALL } from './useTransactionsPage'

export function TransactionsPage() {
	const {
		search,
		setSearch,
		status,
		setStatus,
		role,
		setRole,
		createdFrom,
		setCreatedFrom,
		createdTo,
		setCreatedTo,
		activeFilterCount,
		clearFilters,
		data,
		isLoading,
		isFetching,
		onRefresh,
		pagination,
		sorting,
		goToDetail,
		goToCreate,
	} = useTransactionsPage()

	const columns = useMemo<ColumnDef<Transaction, unknown>[]>(
		() => [
			{
				accessorKey: 'created_at',
				header: 'Created',
				meta: { sortKey: 'created_at', className: 'w-36' },
				cell: ({ row }) => (
					<TimeAgo
						value={row.original.created_at}
						className="text-muted-foreground whitespace-nowrap"
					/>
				),
			},
			{
				accessorKey: 'property_address',
				header: 'Address',
				meta: { sortKey: 'property_address', className: 'w-56' },
				cell: ({ row }) => (
					<div className="wrap-break-word whitespace-normal">
						{row.original.property_address}
					</div>
				),
			},
			{
				accessorKey: 'role',
				header: 'Role',
				meta: { sortKey: 'role', className: 'w-20' },
				cell: ({ row }) => (
					<Badge variant="outline">
						{capitalize(row.original.role)}
					</Badge>
				),
			},
			{
				accessorKey: 'customer_name',
				header: 'Customer',
				meta: { sortKey: 'customer_name', className: 'w-40' },
				cell: ({ row }) => (
					<TextTruncate>{row.original.customer_name}</TextTruncate>
				),
			},
			{
				accessorKey: 'agent_email',
				header: 'Agent',
				meta: { sortKey: 'agent_email', className: 'w-48' },
				cell: ({ row }) => {
					const { agent_id, agent_email } = row.original
					if (!agent_email)
						return <span className="text-muted-foreground">—</span>
					return (
						<Link
							to={`/agents/${agent_id}`}
							className="link"
							onClick={(e) => e.stopPropagation()}
						>
							<TextTruncate>{agent_email}</TextTruncate>
						</Link>
					)
				},
			},
			{
				accessorKey: 'status',
				header: 'Status',
				meta: { sortKey: 'status', className: 'w-24' },
				cell: ({ row }) => {
					const s = row.original.status
					return s === 'active' ? (
						<Badge variant="success">Active</Badge>
					) : (
						<Badge variant="muted">Closed</Badge>
					)
				},
			},
			{
				accessorKey: 'referrals_count',
				header: 'Slots',
				meta: { className: 'w-16 text-center' },
				cell: ({ row }) => (
					<span className="text-muted-foreground">
						{row.original.referrals_count}
					</span>
				),
			},
			{
				accessorKey: 'partner_names',
				header: 'Partners',
				meta: { className: 'w-48' },
				cell: ({ row }) => {
					const names = row.original.partner_names
					if (names.length === 0)
						return <span className="text-muted-foreground">—</span>
					return (
						<div className="flex flex-wrap gap-1">
							{names.map((n, i) => (
								<Badge key={i} variant="outline" className="text-xs">
									{n}
								</Badge>
							))}
						</div>
					)
				},
			},
		],
		[],
	)

	return (
		<ListPage
			title="Transactions"
			description="Real-estate transactions with partner referrals (timeline)"
			actions={
				<Button onClick={goToCreate}>
					<Icon name="plus" />
					Add
				</Button>
			}
			search={search}
			onSearchChange={setSearch}
			searchPlaceholder="Search address, agent email, customer or partner…"
			onRefresh={onRefresh}
			filters={
				<FiltersPopover
					activeCount={activeFilterCount}
					onClear={clearFilters}
				>
					<FilterSelect
						label="Status"
						value={status}
						onChange={setStatus}
						options={[
							{ value: 'active', label: 'Active' },
							{ value: 'closed', label: 'Closed' },
						]}
						allOption={{ value: ALL, label: 'All statuses' }}
					/>
					<FilterSelect
						label="Role"
						value={role}
						onChange={setRole}
						options={[
							{ value: 'Buyer', label: 'Buyer' },
							{ value: 'Seller', label: 'Seller' },
						]}
						allOption={{ value: ALL, label: 'All roles' }}
					/>
					<div className="grid grid-cols-2 gap-3">
						<FilterDate
							label="From"
							value={createdFrom}
							onChange={setCreatedFrom}
							max={createdTo || undefined}
						/>
						<FilterDate
							label="To"
							value={createdTo}
							onChange={setCreatedTo}
							min={createdFrom || undefined}
						/>
					</div>
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
			emptyMessage="No transactions found"
			minWidth="1200px"
			onRowClick={(r) => goToDetail(r.id)}
		/>
	)
}
