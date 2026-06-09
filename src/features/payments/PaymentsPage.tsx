import { useMemo } from 'react'
import { Link } from 'react-router'
import type { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import { ListPage } from '@/components/list/ListPage'
import { FiltersPopover } from '@/components/list/FiltersPopover'
import { FilterSelect } from '@/components/list/FilterSelect'
import { FilterDate } from '@/components/list/FilterDate'
import type { Payment } from '@/types/api'
import { formatAmount, titleizeSlug } from './format'
import { usePaymentsPage, ALL } from './usePaymentsPage'

export function PaymentsPage() {
	const {
		search,
		setSearch,
		paymentType,
		setPaymentType,
		formName,
		setFormName,
		createdFrom,
		setCreatedFrom,
		createdTo,
		setCreatedTo,
		activeFilterCount,
		clearFilters,
		paymentTypes,
		formNames,
		data,
		isLoading,
		isFetching,
		pagination,
		sorting,
		goToDetail,
	} = usePaymentsPage()

	const columns = useMemo<ColumnDef<Payment, unknown>[]>(
		() => [
			{
				accessorKey: 'created_at',
				header: 'When',
				meta: { sortKey: 'created_at', className: 'w-40' },
				cell: ({ row }) => (
					<span className="text-muted-foreground whitespace-nowrap">
						{row.original.created_at.slice(0, 16)}
					</span>
				),
			},
			{
				accessorKey: 'user_email',
				header: 'User',
				meta: { sortKey: 'user_email', className: 'w-64' },
				cell: ({ row }) => {
					const { user_id, user_email } = row.original
					if (!user_email)
						return <span className="text-muted-foreground">—</span>
					return (
						<Link
							to={`/agents/${user_id}`}
							className="link"
							onClick={(e) => e.stopPropagation()}
						>
							{user_email}
						</Link>
					)
				},
			},
			{
				accessorKey: 'referral_name',
				header: 'Referral',
				meta: { sortKey: 'referral_name', className: 'w-48' },
			},
			{
				accessorKey: 'payment_type',
				header: 'Type',
				meta: { sortKey: 'payment_type', className: 'w-32' },
				cell: ({ row }) => (
					<Badge variant="outline">
						{titleizeSlug(row.original.payment_type)}
					</Badge>
				),
			},
			{
				accessorKey: 'form_name',
				header: 'Form',
				meta: { sortKey: 'form_name', className: 'w-44' },
				cell: ({ row }) =>
					row.original.form_name ? (
						titleizeSlug(row.original.form_name)
					) : (
						<span className="text-muted-foreground">—</span>
					),
			},
			{
				accessorKey: 'amount_dollars',
				header: 'Amount',
				meta: { sortKey: 'amount_dollars', className: 'w-32' },
				cell: ({ row }) => (
					<span className="whitespace-nowrap font-medium">
						{formatAmount(row.original.amount_dollars)}
					</span>
				),
			},
		],
		[],
	)

	return (
		<ListPage
			title="Payments"
			description="Payments recorded for referrals and forms (read-only)"
			search={search}
			onSearchChange={setSearch}
			searchPlaceholder="Search…"
			filters={
				<FiltersPopover
					activeCount={activeFilterCount}
					onClear={clearFilters}
				>
					<FilterSelect
						label="Payment type"
						value={paymentType}
						onChange={setPaymentType}
						options={paymentTypes.map((t) => ({
							value: t,
							label: titleizeSlug(t),
						}))}
						allOption={{ value: ALL, label: 'All types' }}
					/>
					<FilterSelect
						label="Form"
						value={formName}
						onChange={setFormName}
						options={formNames.map((f) => ({
							value: f,
							label: titleizeSlug(f),
						}))}
						allOption={{ value: ALL, label: 'All forms' }}
					/>
					<div className="grid grid-cols-2 gap-3">
						<FilterDate
							label="From"
							value={createdFrom}
							onChange={setCreatedFrom}
						/>
						<FilterDate
							label="To"
							value={createdTo}
							onChange={setCreatedTo}
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
			emptyMessage="No payments found"
			minWidth="1000px"
			onRowClick={(r) => goToDetail(r.id)}
		/>
	)
}
