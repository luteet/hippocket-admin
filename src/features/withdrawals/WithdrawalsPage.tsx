import { useMemo } from 'react'
import { Link } from 'react-router'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ListPage } from '@/components/list/ListPage'
import { FiltersPopover } from '@/components/list/FiltersPopover'
import { FilterSelect } from '@/components/list/FilterSelect'
import type { Withdrawal } from '@/types/api'
import {
	useWithdrawalsPage,
	ALL,
	STATUS_OPTIONS,
	METHOD_OPTIONS,
} from './useWithdrawalsPage'
import {
	formatAmount,
	formatDateTime,
	methodLabel,
	STATUS_BADGE,
} from './format'

export function WithdrawalsPage() {
	const {
		search,
		setSearch,
		status,
		setStatus,
		method,
		setMethod,
		activeFilterCount,
		clearFilters,
		data,
		isLoading,
		isFetching,
		pagination,
		openWithdrawal,
		goToCreate,
	} = useWithdrawalsPage()

	const columns = useMemo<ColumnDef<Withdrawal, unknown>[]>(
		() => [
			{
				accessorKey: 'user_full_name',
				header: 'Agent',
				cell: ({ row }) => {
					const { user_id, user_full_name, user_email } = row.original
					return (
						<Link
							to={`/agents/${user_id}`}
							className="link"
							onClick={(e) => e.stopPropagation()}
						>
							{user_full_name || user_email}
						</Link>
					)
				},
			},
			{
				accessorKey: 'amount',
				header: 'Amount',
				cell: ({ row }) => formatAmount(row.original.amount),
			},
			{
				accessorKey: 'method',
				header: 'Method',
				cell: ({ row }) => methodLabel(row.original.method),
			},
			{
				accessorKey: 'status',
				header: 'Status',
				cell: ({ row }) => (
					<Badge
						variant={STATUS_BADGE[row.original.status]}
						className="capitalize"
					>
						{row.original.status}
					</Badge>
				),
			},
			{
				accessorKey: 'created_at',
				header: 'Created At',
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
			title="Withdrawals"
			description="Browse agent withdrawal requests"
			actions={
				<Button onClick={goToCreate}>
					<Icon name="plus" />
					Add
				</Button>
			}
			search={search}
			onSearchChange={setSearch}
			searchPlaceholder="Search by agent…"
			filters={
				<FiltersPopover
					activeCount={activeFilterCount}
					onClear={clearFilters}
				>
					<FilterSelect
						label="Status"
						value={status}
						onChange={setStatus}
						options={STATUS_OPTIONS}
						allOption={{ value: ALL, label: 'All statuses' }}
					/>
					<FilterSelect
						label="Method"
						value={method}
						onChange={setMethod}
						options={METHOD_OPTIONS}
						allOption={{ value: ALL, label: 'All methods' }}
					/>
				</FiltersPopover>
			}
			pagination={pagination}
			data={data}
			isLoading={isLoading}
			isFetching={isFetching}
			columns={columns}
			emptyMessage="No withdrawals found"
			minWidth="800px"
			onRowClick={(w) => openWithdrawal(w.id)}
		/>
	)
}
