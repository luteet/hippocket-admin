import { Badge } from '@/components/ui/badge'
import { DetailPage } from '@/components/detail/DetailPage'
import { DetailBody } from '@/components/detail/DetailBody'
import { PartnerReviewsTab } from './PartnerReviewsTab'
import { usePartnerDetailPage } from './usePartnerDetailPage'
import {
	formatAmount,
	formatDateTime,
	formatFee,
	valueTypeLabel,
} from './format'

export function PartnerDetailPage() {
	const {
		partner,
		partnerId,
		isLoading,
		tab,
		setTab,
		isDeleting,
		handleDelete,
		goBack,
		goToEdit,
	} = usePartnerDetailPage()

	return (
		<DetailPage
			title="Partner"
			onBack={goBack}
			ready={Boolean(partner)}
			isLoading={isLoading}
			onEdit={goToEdit}
			onDelete={handleDelete}
			deleteTitle="Delete partner?"
			deleteDescription={`Partner "${partner?.name ?? ''}" will be permanently deleted.`}
			isDeleting={isDeleting}
			activeTab={tab}
			onTabChange={(key) => setTab(key as typeof tab)}
			tabs={[
				{
					key: 'details',
					label: 'Details',
					content: partner ? (
						<DetailBody
							heading={{
								title: partner.name,
								subtitle: partner.subtitle,
								badge: partner.is_hide ? (
									<Badge variant="muted">Hidden</Badge>
								) : (
									<Badge variant="success">Active</Badge>
								),
							}}
							intro={
								partner.description && (
									<p className="text-sm wrap-break-word whitespace-pre-line text-muted-foreground">
										{partner.description}
									</p>
								)
							}
							fields={[
								{ label: 'Email', value: partner.email },
								{ label: 'Phone', value: partner.phone },
								{ label: 'Website', value: partner.website },
								{ label: 'Address', value: partner.address },
								{
									label: 'Category',
									value: partner.category_name,
								},
								{
									label: 'Service',
									value: partner.service_name,
								},
								{
									label: 'Location',
									value: partner.location_name,
								},
								{
									label: 'Group',
									value: partner.chosen_group_name,
								},
								{
									label: 'Referral fee',
									value: partner.referral_fee ?? '',
								},
								{
									label: 'Potential value',
									value:
										partner.potential_value != null
											? formatAmount(
													partner.potential_value,
													partner.value_type,
												)
											: '',
								},
								{
									label: 'Agent fee',
									value: formatFee(partner),
								},
								{
									label: 'Group owner fee',
									value: formatAmount(
										partner.group_owner_fee,
										partner.value_type,
									),
								},
								{
									label: 'Hippocket fee',
									value: formatAmount(
										partner.hippocket_fee,
										partner.value_type,
									),
								},
								{
									label: 'Value type',
									value: valueTypeLabel(partner.value_type),
								},
								{
									label: 'SMS notifications',
									value: partner.sms_notifications_enabled
										? 'On'
										: 'Off',
								},
								{
									label: 'SMS phone',
									value: partner.sms_phone,
								},
								{
									label: 'Logins',
									value: partner.count_login,
								},
								{
									label: 'Last login',
									value: formatDateTime(partner.last_login),
								},
								{
									label: 'Created',
									value: formatDateTime(partner.created_at),
								},
								{
									label: 'Updated',
									value: formatDateTime(partner.updated_at),
								},
							]}
						/>
					) : null,
				},
				{
					key: 'reviews',
					label: 'Reviews',
					bare: true,
					content: partnerId ? (
						<PartnerReviewsTab partnerId={partnerId} />
					) : null,
				},
			]}
		/>
	)
}
