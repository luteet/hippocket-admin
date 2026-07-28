import { Link } from 'react-router'

import { Badge } from '@/components/ui/badge'
import { DetailPage } from '@/components/detail/DetailPage'
import { DetailPageProvider } from '@/components/detail/DetailPageContext'
import { usePaymentDetailPage } from './usePaymentDetailPage'
import { formatAmount, formatDateTime, titleizeSlug } from './format'

export function PaymentDetailPage() {
	const { payment, ...detailCtx } = usePaymentDetailPage()

	return (
		<DetailPageProvider value={detailCtx}>
			<DetailPage
				title="Payment"
				heading={
					payment
						? {
								title: formatAmount(payment.amount_dollars),
								subtitle: formatDateTime(payment.created_at),
								badge: (
									<Badge variant="outline">
										{titleizeSlug(payment.payment_type)}
									</Badge>
								),
							}
						: undefined
				}
				fields={
					payment
						? [
								{
									label: 'User',
									render: (
										<Link
											to={`/agents/${payment.user_id}`}
											className="link"
										>
											{payment.user_email}
										</Link>
									),
								},
								{ label: 'User ID', value: payment.user_id },
								{
									label: 'Referral',
									value: payment.referral_name,
								},
								{
									label: 'Referral type',
									value: payment.referral_type,
								},
								{
									label: 'Referral partner',
									value: payment.referral_partner,
								},
								{
									label: 'Payment type',
									value: titleizeSlug(payment.payment_type),
								},
								{
									label: 'Form',
									value: payment.form_name
										? titleizeSlug(payment.form_name)
										: null,
								},
								{
									label: 'Amount',
									value: formatAmount(payment.amount_dollars),
								},
								{
									label: 'Amount (raw)',
									value: payment.amount,
								},
								{
									label: 'Payment intent ID',
									value: payment.payment_intent_id,
								},
								{
									label: 'Created',
									value: formatDateTime(payment.created_at),
								},
							]
						: undefined
				}
			/>
		</DetailPageProvider>
	)
}
