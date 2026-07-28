import { Link } from 'react-router'

import { Badge } from '@/components/ui/badge'
import { DetailPage } from '@/components/detail/DetailPage'
import { DetailPageProvider } from '@/components/detail/DetailPageContext'
import { TimeAgo } from '@/components/TimeAgo'
import { useWithdrawalDetailPage } from './useWithdrawalDetailPage'
import { formatAmount, methodLabel, STATUS_BADGE } from './format'

export function WithdrawalDetailPage() {
	const { withdrawal, ...detailCtx } = useWithdrawalDetailPage()

	return (
		<DetailPageProvider value={detailCtx}>
			<DetailPage
				title="Withdrawal"
				deleteTitle="Delete withdrawal?"
				deleteDescription="This withdrawal request will be permanently deleted."
				heading={
					withdrawal
						? {
								title: formatAmount(withdrawal.amount),
								subtitle: methodLabel(withdrawal.method),
								badge: (
									<Badge
										variant={STATUS_BADGE[withdrawal.status]}
										className="capitalize"
									>
										{withdrawal.status}
									</Badge>
								),
							}
						: undefined
				}
				fields={
					withdrawal
						? [
								{
									label: 'Agent',
									render: (
										<Link
											to={`/agents/${withdrawal.user_id}`}
											className="link"
										>
											{withdrawal.user_full_name ||
												withdrawal.user_email}
										</Link>
									),
								},
								{ label: 'Email', value: withdrawal.user_email },
								{
									label: 'Amount',
									value: formatAmount(withdrawal.amount),
								},
								{
									label: 'Method',
									value: methodLabel(withdrawal.method),
								},
								{
									label: 'Status',
									value: withdrawal.status,
									capitalize: true,
								},
								{
									label: 'Payment details',
									value: withdrawal.payment_details,
								},
								{ label: 'PayPal', value: withdrawal.paypal_data },
								{ label: 'Venmo', value: withdrawal.venmo_id },
								{
									label: 'Cash App',
									value: withdrawal.cash_app_info,
								},
								{ label: 'Zelle', value: withdrawal.zelle },
								{
									label: 'Created',
									render: (
										<TimeAgo value={withdrawal.created_at} />
									),
								},
							]
						: undefined
				}
			/>
		</DetailPageProvider>
	)
}
