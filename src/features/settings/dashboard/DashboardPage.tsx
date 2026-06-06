import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { PageHeader } from '@/components/layout/PageHeader'
import { Skeleton } from '@/components/ui/skeleton'
import { DataTable } from '@/components/DataTable'
import type { GroupOverview } from '@/types/api'
import { useDashboardPage } from './useDashboardPage'
import { StatCard } from './components/StatCard'

const money = (n: number) => `$${n.toFixed(2)}`
const num = (n: number) => n.toLocaleString('en-US')

export function DashboardPage() {
	const { stats, isLoading } = useDashboardPage()

	const columns = useMemo<ColumnDef<GroupOverview, unknown>[]>(
		() => [
			{ accessorKey: 'name', header: 'Group' },
			{
				accessorKey: 'users',
				header: 'Users',
				cell: ({ row }) => num(row.original.users),
			},
			{
				accessorKey: 'closed_referrals',
				header: 'Closed referrals',
				cell: ({ row }) => num(row.original.closed_referrals),
			},
		],
		[],
	)

	if (isLoading || !stats) {
		return (
			<div>
				<PageHeader title="Dashboard" description="Platform overview" />
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
					{Array.from({ length: 8 }).map((_, i) => (
						<Skeleton key={i} className="h-24 w-full" />
					))}
				</div>
			</div>
		)
	}

	const metrics: { label: string; value: string; to?: string }[] = [
		{ label: 'Users', value: num(stats.total_users), to: '/agents' },
		{
			label: 'Partners',
			value: num(stats.total_partners),
			to: '/partners',
		},
		{ label: 'Groups', value: num(stats.total_groups), to: '/groups' },
		{ label: 'Contacts', value: num(stats.total_contacts) },
		{ label: 'Chat messages', value: num(stats.total_chat_messages) },
		{
			label: 'Admin logs',
			value: num(stats.total_admin_logs),
			to: '/logs',
		},
		{
			label: 'Sent referrals',
			value: num(stats.total_sent_referrals),
			to: '/logs/referrals-sent',
		},
		{
			label: 'Closed referrals',
			value: num(stats.total_closed_referrals),
			to: '/logs/referrals-closed',
		},
	]

	const financial: { label: string; value: string }[] = [
		{
			label: 'Paid by partners',
			value: money(stats.financial.total_paid_by_partners),
		},
		{
			label: 'Payout to agents',
			value: money(stats.financial.payout_to_agents),
		},
		{
			label: 'Payout to group owners',
			value: money(stats.financial.payout_to_group_owners),
		},
		{
			label: 'Hippocket earnings',
			value: money(stats.financial.hippocket_earnings),
		},
	]

	return (
		<div className="space-y-8">
			<PageHeader title="Dashboard" description="Platform overview" />

			<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
				{metrics.map((m) => (
					<StatCard
						key={m.label}
						label={m.label}
						value={m.value}
						to={m.to}
					/>
				))}
			</div>

			<div>
				<h2 className="mb-3 text-lg font-medium text-muted-foreground">
					Financial
				</h2>
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
					{financial.map((m) => (
						<StatCard
							key={m.label}
							label={m.label}
							value={m.value}
						/>
					))}
				</div>
			</div>

			<div>
				<h2 className="mb-3 text-lg font-medium text-muted-foreground">
					Groups overview
				</h2>
				<DataTable
					columns={columns}
					data={stats.groups_overview}
					emptyMessage="No groups"
					minWidth="480px"
				/>
			</div>
		</div>
	)
}
