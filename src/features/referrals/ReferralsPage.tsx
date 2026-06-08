import { useMemo } from 'react'
import { Link } from 'react-router'
import type { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import { ListPage } from '@/components/list/ListPage'
import { FiltersPopover } from '@/components/list/FiltersPopover'
import { FilterSelect } from '@/components/list/FilterSelect'
import type { ReferralListItem } from '@/types/api'
import { useReferralsPage, ALL } from './useReferralsPage'

const PAID_OPTIONS = [
	{ value: ALL, label: 'All' },
	{ value: 'true', label: 'Paid' },
	{ value: 'false', label: 'Unpaid' },
]

export function ReferralsPage() {
	const {
		search,
		setSearch,
		statusLabel,
		setStatusLabel,
		isPaid,
		setIsPaid,
		activeFilterCount,
		clearFilters,
		statuses,
		statusNameByLabel,
		data,
		isLoading,
		isFetching,
		pagination,
		goToDetail,
	} = useReferralsPage()

	const statusOptions = useMemo(
		() =>
			statuses?.items.map((s) => ({ value: s.label, label: s.name })) ??
			[],
		[statuses],
	)

	const columns = useMemo<ColumnDef<ReferralListItem, unknown>[]>(
		() => [
			{ accessorKey: 'referral_name', header: 'Referral' },
			{ accessorKey: 'agent_email', header: 'Agent' },
			{
				accessorKey: 'partner_name',
				header: 'Partner',
				cell: ({ row }) => {
					const { partner_id, partner_name } = row.original
					if (!partner_id) return partner_name
					return (
						<Link
							to={`/partners/${partner_id}`}
							className="text-primary underline underline-offset-[5px] transition-[filter] hover:brightness-110 active:brightness-90"
							onClick={(e) => e.stopPropagation()}
						>
							{partner_name}
						</Link>
					)
				},
			},
			{
				accessorKey: 'status',
				header: 'Status',
				cell: ({ row }) => (
					<Badge variant="outline">
						{statusNameByLabel[row.original.status] ??
							row.original.status}
					</Badge>
				),
			},
			{
				accessorKey: 'potential_value',
				header: 'Potential',
			},
			{
				id: 'is_paid',
				header: 'Payment',
				cell: ({ row }) =>
					row.original.is_paid ? (
						<Badge variant="success">Paid</Badge>
					) : (
						<Badge variant="muted">No</Badge>
					),
			},
			{
				accessorKey: 'created_at',
				header: 'Created',
				cell: ({ row }) => (
					<span className="text-muted-foreground">
						{row.original.created_at.slice(0, 16)}
					</span>
				),
			},
		],
		[statusNameByLabel],
	)

	return (
		<ListPage
			title="Pipeline Logs"
			description="Pipeline log requests, statuses, and payouts"
			search={search}
			onSearchChange={setSearch}
			searchPlaceholder="Search…"
			filters={
				<FiltersPopover
					activeCount={activeFilterCount}
					onClear={clearFilters}
				>
					<FilterSelect
						label="Status"
						value={statusLabel}
						onChange={setStatusLabel}
						options={statusOptions}
						allOption={{ value: ALL, label: 'All statuses' }}
					/>
					<FilterSelect
						label="Payment"
						value={isPaid}
						onChange={setIsPaid}
						options={PAID_OPTIONS}
					/>
				</FiltersPopover>
			}
			pagination={pagination}
			data={data}
			isLoading={isLoading}
			isFetching={isFetching}
			columns={columns}
			emptyMessage="No pipeline logs found"
			minWidth="1200px"
			onRowClick={(r) => goToDetail(r.id)}
		/>
	)
}
