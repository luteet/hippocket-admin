import { useMemo } from 'react'
import { Link } from 'react-router'
import type { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/Icon'
import { TimeAgo } from '@/components/TimeAgo'
import { ListPage } from '@/components/list/ListPage'
import { FiltersPopover } from '@/components/list/FiltersPopover'
import { FilterSelect } from '@/components/list/FilterSelect'
import { BulkActionBar, type BulkAction } from '@/components/list/BulkActionBar'
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
		activeFilters,
		removeFilter,
		clearFilters,
		statuses,
		statusNameByLabel,
		data,
		isLoading,
		isFetching,
		onRefresh,
		pagination,
		sorting,
		goToDetail,
		selectedIds,
		setSelectedIds,
		clearSelection,
		selectedCount,
		isBulkRunning,
		bulkMarkPaid,
		bulkDelete,
	} = useReferralsPage()

	const plural = selectedCount === 1 ? '' : 's'
	const bulkActions: BulkAction[] = [
		{
			label: 'Mark paid',
			icon: 'badge-dollar',
			confirm: {
				title: `Mark ${selectedCount} pipeline log${plural} as paid?`,
				confirmLabel: 'Mark paid',
			},
			onRun: bulkMarkPaid,
		},
		{
			label: 'Delete',
			icon: 'trash-2',
			destructive: true,
			confirm: {
				title: `Delete ${selectedCount} pipeline log${plural}?`,
				description:
					'This permanently removes the selected pipeline logs.',
				confirmLabel: 'Delete',
			},
			onRun: bulkDelete,
		},
	]

	const statusOptions = useMemo(
		() =>
			statuses?.items.map((s) => ({ value: s.label, label: s.name })) ??
			[],
		[statuses],
	)

	const columns = useMemo<ColumnDef<ReferralListItem, unknown>[]>(
		() => [
			{
				accessorKey: 'referral_name',
				header: 'Referral',
				meta: { sortKey: 'referral_name', className: 'w-48' },
			},
			{
				accessorKey: 'agent_email',
				header: 'Agent',
				meta: { sortKey: 'agent_email', className: 'w-60' },
			},
			{
				accessorKey: 'partner_name',
				header: 'Partner',
				meta: { sortKey: 'partner_name', className: 'w-47' },
				cell: ({ row }) => {
					const { partner_id, partner_name } = row.original
					if (!partner_id) return partner_name
					return (
						<Link
							to={`/partners/${partner_id}`}
							className="link"
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
				meta: { sortKey: 'status', className: 'w-45' },
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
				meta: { className: 'w-32' },
			},
			{
				id: 'is_paid',
				header: 'Payment',
				meta: { sortKey: 'is_paid', className: 'w-32' },
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
				meta: { sortKey: 'created_at', className: 'w-40' },
				cell: ({ row }) => (
					<TimeAgo
						value={row.original.created_at}
						className="text-muted-foreground"
					/>
				),
			},
		],
		[statusNameByLabel],
	)

	return (
		<ListPage
			title="Pipeline Logs"
			description="Pipeline log requests, statuses, and payouts"
			actions={
				<Button asChild variant="outline">
					<Link to="/referrals/export">
						<Icon name="download" />
						<span className="sm:inline hidden">Export</span>
					</Link>
				</Button>
			}
			search={search}
			onSearchChange={setSearch}
			searchPlaceholder="Search…"
			onRefresh={onRefresh}
			activeFilters={activeFilters}
			onRemoveFilter={removeFilter}
			onClearFilters={clearFilters}
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
			sorting={{
				sortBy: sorting.sortBy,
				order: sorting.order,
				onToggle: sorting.toggle,
			}}
			emptyMessage="No pipeline logs found"
			minWidth="1200px"
			onRowClick={(r) => goToDetail(r.id)}
			selection={{
				getRowId: (r) => r.id,
				selectedIds,
				onSelectionChange: setSelectedIds,
			}}
			className={selectedCount > 0 ? 'pb-24' : undefined}
			footer={
				<BulkActionBar
					count={selectedCount}
					actions={bulkActions}
					onClear={clearSelection}
					isRunning={isBulkRunning}
				/>
			}
		/>
	)
}
