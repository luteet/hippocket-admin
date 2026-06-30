import { useMemo } from 'react'
import { Link } from 'react-router'
import type { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { TextTruncate } from '@/components/TextTruncate'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Icon } from '@/components/Icon'
import { TimeAgo } from '@/components/TimeAgo'
import { ListPage } from '@/components/list/ListPage'
import { EmptyState } from '@/components/EmptyState'
import { FiltersPopover } from '@/components/list/FiltersPopover'
import { FilterSelect } from '@/components/list/FilterSelect'
import { BulkActionBar, type BulkAction } from '@/components/list/BulkActionBar'
import { GroupMultiSelect } from '@/components/GroupMultiSelect'
import type { ReferralListItem, ValueType } from '@/types/api'
import { useReferralsPage, ALL } from './useReferralsPage'

function formatPotentialValue(value: number, valueType: ValueType) {
	if (valueType === 'tokens') {
		return `${value.toLocaleString('ru-RU')} Token${value === 1 ? '' : 's'}`
	}
	return `$${value.toLocaleString('ru-RU')}`
}

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
		groupIds,
		toggleGroupId,
		groupOptions,
		activeFilterCount,
		activeFilters,
		removeFilter,
		clearFilters,
		hasFilters,
		clearAll,
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
		totalPipelinePotential,
	} = useReferralsPage()

	const plural = selectedCount === 1 ? '' : 's'
	const pipelinePotentialDisplay =
		totalPipelinePotential != null
			? `$${totalPipelinePotential.toFixed(2)}`
			: null
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

	// Pipeline logs have no create route (they originate from agents), so the
	// genuinely-empty state offers only a description — no CTA to act on.
	const emptyState = hasFilters ? (
		<EmptyState
			icon="search-x"
			title="No results"
			description="No pipeline logs match your current search or filters."
			action={
				<Button variant="secondary" size="sm" onClick={clearAll}>
					Clear filters
				</Button>
			}
		/>
	) : (
		<EmptyState
			icon="inbox"
			title="No pipeline logs yet"
			description="Pipeline logs will appear here as agents submit them."
		/>
	)

	const statusOptions = useMemo(
		() =>
			statuses?.items.map((s) => ({ value: s.label, label: s.name })) ??
			[],
		[statuses],
	)

	const columns = useMemo<ColumnDef<ReferralListItem, unknown>[]>(
		() => [
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
			{
				accessorKey: 'referral_name',
				header: 'Referral',
				meta: { sortKey: 'referral_name', className: 'w-48' },
				cell: ({ row }) => {
					const { id, referral_name } = row.original
					return (
						<Link
							to={`/referrals/${id}`}
							className="link"
							onClick={(e) => e.stopPropagation()}
						>
							{referral_name}
						</Link>
					)
				},
			},
			{
				accessorKey: 'group_name',
				header: 'Group',
				meta: { className: 'w-40' },
				cell: ({ row }) => {
					const { group_id, group_name } = row.original
					if (!group_id) {
						return (
							<span className="text-muted-foreground">
								—
							</span>
						)
					}
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
				accessorKey: 'agent_email',
				header: 'Agent',
				meta: { sortKey: 'agent_email', className: 'w-60' },
				cell: ({ getValue }) => (
					<TextTruncate>{getValue<string>()}</TextTruncate>
				),
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
				id: 'value_type',
				header: 'Value Type',
				meta: { sortKey: 'value_type', className: 'w-32' },
				cell: ({ row }) =>
					row.original.value_type === "money" ? (
						<span className="text-center">Money ($)</span>
					) : (
						<span className="text-center">Tokens</span>
					),
			},
			{
				accessorKey: 'potential_value',
				header: 'Potential value',
				meta: { className: 'w-42' }
			},
			{
				accessorKey: 'agent_potential_value',
				header: 'Agent potential value',
				meta: { sortKey: 'agent_potential_value', className: 'w-55' },
				cell: ({ row }) => {
					const v = row.original.agent_potential_value
					if (v == null) return <span className="text-muted-foreground">—</span>
					return formatPotentialValue(v, row.original.value_type)
				},
			},
			{
				accessorKey: 'partner_potential_value',
				header: 'Partner potential value',
				meta: { sortKey: 'partner_potential_value', className: 'w-58' },
				cell: ({ row }) => {
					const v = row.original.partner_potential_value
					if (v == null) return <span className="text-muted-foreground">—</span>
					return formatPotentialValue(v, row.original.value_type)
				},
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
				id: 'coin_course',
				header: 'Token course',
				meta: { sortKey: 'coin_course', className: 'w-45' },
				cell: ({ row }) => {
					return row.original.coin_course.toFixed(2);
				},
			},
		],
		[statusNameByLabel],
	)

	return (
		<ListPage
			title="Pipeline Logs"
			description="Pipeline log requests, statuses, and payouts"
			actions={
				<>
					<Card className="px-4 min-h-14 ml-auto flex justify-end items-center gap-2">
						<div className="text-end">
							<p className="pt-1 pb-1 text-xs text-muted-foreground leading-tight">
								Total Pipeline Potential
							</p>
							<div className="flex justify-end">
								{isFetching ? (
									<Skeleton className="inline-block h-5 w-24" />
								) : (
									<p className="min-h-3 font-semibold text-[#111111] leading-tight">
										{pipelinePotentialDisplay}
									</p>
								)}
							</div>
						</div>
					</Card>
					<Button asChild variant="outline">
						<Link to="/referrals/export">
							<Icon name="download" />
							<span className="sm:inline hidden">Export</span>
						</Link>
					</Button>
				</>
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
					<div className="space-y-1.5">
						<Label>Group</Label>
						<GroupMultiSelect
							options={groupOptions ?? []}
							selected={groupIds}
							onToggle={toggleGroupId}
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
			emptyMessage={emptyState}
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
