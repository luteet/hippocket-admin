import * as React from 'react'
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
import { usePagination } from '@/hooks/usePagination'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import type { ReferralListItem } from '@/types/api'
import { useReferrals, useStatuses } from './hooks'
import { ReferralDetailDialog } from './ReferralDetailDialog'

const ALL = '__all__'
const PAID_OPTIONS = [
	{ value: ALL, label: 'All' },
	{ value: 'true', label: 'Paid' },
	{ value: 'false', label: 'Unpaid' },
]

export function ReferralsPage() {
	const [search, setSearch] = React.useState('')
	const debouncedSearch = useDebouncedValue(search)
	const [statusLabel, setStatusLabel] = React.useState(ALL)
	const [isPaid, setIsPaid] = React.useState(ALL)
	const pagination = usePagination({ count: 20 })

	const { data: statuses } = useStatuses()

	React.useEffect(() => {
		pagination.reset()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearch, statusLabel, isPaid])

	const { data, isLoading, isFetching } = useReferrals({
		offset: pagination.offset,
		count: pagination.count,
		search: debouncedSearch || undefined,
		status_label: statusLabel === ALL ? undefined : statusLabel,
		is_paid: isPaid === ALL ? undefined : isPaid === 'true',
	})

	const [openId, setOpenId] = React.useState<string | null>(null)

	const columns = React.useMemo<ColumnDef<ReferralListItem, unknown>[]>(
		() => [
			{ accessorKey: 'referral_name', header: 'Referral' },
			{ accessorKey: 'agent_email', header: 'Agent' },
			{ accessorKey: 'partner_name', header: 'Partner' },
			{
				accessorKey: 'status',
				header: 'Status',
				cell: ({ row }) => (
					<Badge variant="outline">{row.original.status}</Badge>
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
		[],
	)

	return (
		<div>
			<PageHeader
				title="Referrals"
				description="Referral requests, statuses, and payouts"
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
						{statuses?.map((s) => (
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
			</div>

			<DataTable
				columns={columns}
				data={data ?? []}
				isLoading={isLoading || isFetching}
				emptyMessage="No referrals found"
				onRowClick={(r) => setOpenId(r.id)}
				pagination={{
					page: pagination.page,
					hasPrev: pagination.hasPrev,
					hasNext: pagination.canNext(data?.length ?? 0),
					onPrev: pagination.prev,
					onNext: pagination.next,
				}}
			/>

			<ReferralDetailDialog
				referralId={openId}
				onOpenChange={(o) => !o && setOpenId(null)}
			/>
		</div>
	)
}
