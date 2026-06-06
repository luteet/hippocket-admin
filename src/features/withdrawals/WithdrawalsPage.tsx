import { useMemo } from 'react'
import { Link } from 'react-router'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { PAGE_SIZE_OPTIONS } from '@/hooks/usePagination'
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
							className="text-primary underline underline-offset-[5px] transition-[filter] hover:brightness-110 active:brightness-90"
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
		<div>
			<PageHeader
				title="Withdrawals"
				description="Browse agent withdrawal requests"
				actions={
					<Button onClick={goToCreate}>
						<Icon name="plus" />
						Add
					</Button>
				}
			/>

			<div className="mb-4 flex flex-wrap gap-3 flex-col sm:items-center sm:flex-row">
				<div className="relative sm:max-w-xs flex-1 min-w-40">
					<Icon
						name="search"
						className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
					/>
					<Input
						placeholder="Search by agent…"
						className="pl-9"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>

				<Select value={status} onValueChange={setStatus}>
					<SelectTrigger className="sm:w-36">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={ALL}>All statuses</SelectItem>
						{STATUS_OPTIONS.map((o) => (
							<SelectItem key={o.value} value={o.value}>
								{o.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select value={method} onValueChange={setMethod}>
					<SelectTrigger className="sm:w-36">
						<SelectValue placeholder="Method" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={ALL}>All methods</SelectItem>
						{METHOD_OPTIONS.map((o) => (
							<SelectItem key={o.value} value={o.value}>
								{o.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select
					value={String(pagination.count)}
					onValueChange={(v) => pagination.setCount(Number(v))}
				>
					<SelectTrigger className="ml-auto sm:w-36">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{PAGE_SIZE_OPTIONS.map((n) => (
							<SelectItem key={n} value={String(n)}>
								{n} per page
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<DataTable
				columns={columns}
				data={data?.items ?? []}
				isLoading={isLoading || isFetching}
				emptyMessage="No withdrawals found"
				minWidth="800px"
				skeletonRows={pagination.count}
				onRowClick={(w) => openWithdrawal(w.id)}
				pagination={{
					page: pagination.page,
					pageCount: pagination.pageCount(data?.total ?? 0),
					onPageChange: pagination.goTo,
				}}
			/>
		</div>
	)
}
