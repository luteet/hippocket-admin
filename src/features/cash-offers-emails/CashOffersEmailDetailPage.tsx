import { Badge } from '@/components/ui/badge'
import { DetailPage } from '@/components/detail/DetailPage'
import { useCashOffersEmailDetailPage } from './useCashOffersEmailDetailPage'
import { formatDateTime, groupScopeLabel } from './format'

export function CashOffersEmailDetailPage() {
	const { email, isLoading, isDeleting, handleDelete, goBack, goToEdit } =
		useCashOffersEmailDetailPage()

	return (
		<DetailPage
			title="Cash Offers Email"
			onBack={goBack}
			ready={Boolean(email)}
			isLoading={isLoading}
			onEdit={goToEdit}
			onDelete={handleDelete}
			deleteTitle="Delete email?"
			deleteDescription={`"${email?.email ?? ''}" will be permanently deleted.`}
			isDeleting={isDeleting}
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
	)
}
