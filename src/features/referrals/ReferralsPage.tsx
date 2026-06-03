import { useMemo } from 'react'
import { Link } from 'react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { Search } from 'lucide-react'

import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/DataTable'
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
import type { ReferralListItem } from '@/types/api'
import { useReferralsPage, ALL } from './useReferralsPage'
import { ReferralDetailDialog } from './ReferralDetailDialog'

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
		statuses,
		statusNameByLabel,
		partnerIdByName,
		data,
		isLoading,
		isFetching,
		pagination,
		openId,
		setOpenId,
	} = useReferralsPage()

	const columns = useMemo<ColumnDef<ReferralListItem, unknown>[]>(
		() => [
			{ accessorKey: 'referral_name', header: 'Referral' },
			{ accessorKey: 'agent_email', header: 'Agent' },
			{
				accessorKey: 'partner_name',
				header: 'Partner',
				cell: ({ row }) => {
					const { partner_name } = row.original
					const partnerId = partnerIdByName[partner_name]
					if (!partnerId) return partner_name
					return (
						<Link
							to={`/partners/${partnerId}`}
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
		[statusNameByLabel, partnerIdByName],
	)

	return (
		<div>
			<PageHeader
				title="Pipeline Logs"
				description="Pipeline log requests, statuses, and payouts"
			/>

			<div className="mb-4 flex flex-wrap items-center gap-3">
				<div className="relative max-w-xs flex-1">
					<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Search…"
						className="pl-9"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>

				<Select value={statusLabel} onValueChange={setStatusLabel}>
					<SelectTrigger className="w-44">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={ALL}>All statuses</SelectItem>
						{statuses?.items.map((s) => (
							<SelectItem key={s.id} value={s.label}>
								{s.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select value={isPaid} onValueChange={setIsPaid}>
					<SelectTrigger className="w-40">
						<SelectValue placeholder="Payment" />
					</SelectTrigger>
					<SelectContent>
						{PAID_OPTIONS.map((o) => (
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
					<SelectTrigger className="ml-auto w-36">
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
				emptyMessage="No pipeline logs found"
				skeletonRows={pagination.count}
				onRowClick={(r) => setOpenId(r.id)}
				pagination={{
					page: pagination.page,
					pageCount: pagination.pageCount(data?.total ?? 0),
					onPageChange: pagination.goTo,
				}}
			/>

			<ReferralDetailDialog
				referralId={openId}
				onOpenChange={(o) => !o && setOpenId(null)}
			/>
		</div>
	)
}
