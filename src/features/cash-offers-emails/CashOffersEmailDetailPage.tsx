import { Badge } from '@/components/ui/badge'
import { DetailPage } from '@/components/detail/DetailPage'
import { DetailPageProvider } from '@/components/detail/DetailPageContext'
import { useCashOffersEmailDetailPage } from './useCashOffersEmailDetailPage'
import { formatDateTime, groupScopeLabel } from './format'

export function CashOffersEmailDetailPage() {
	const { email, ...detailCtx } = useCashOffersEmailDetailPage()

	return (
		<DetailPageProvider value={detailCtx}>
			<DetailPage
				title="Cash Offers Email"
				deleteTitle="Delete email?"
				deleteDescription={`"${email?.email ?? ''}" will be permanently deleted.`}
				heading={
					email
						? {
								title: email.name,
								subtitle: email.email,
								badge: email.is_active ? (
									<Badge variant="success">Active</Badge>
								) : (
									<Badge variant="muted">Inactive</Badge>
								),
							}
						: undefined
				}
				fields={
					email
						? [
								{ label: 'Name', value: email.name },
								{ label: 'Email', value: email.email },
								{
									label: 'Group',
									value: groupScopeLabel(email.group_name),
								},
								{
									label: 'Created',
									value: formatDateTime(email.created_at),
								},
							]
						: undefined
				}
			/>
		</DetailPageProvider>
	)
}
