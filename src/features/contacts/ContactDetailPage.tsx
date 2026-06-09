import { Link } from 'react-router'

import { Badge } from '@/components/ui/badge'
import { DetailPage } from '@/components/detail/DetailPage'
import { useContactDetailPage } from './useContactDetailPage'
import { formatDateTime, fullName } from './format'

export function ContactDetailPage() {
	const { contact, isLoading, isDeleting, handleDelete, goBack, goToEdit } =
		useContactDetailPage()

	return (
		<DetailPage
			title="Contact"
			onBack={goBack}
			ready={Boolean(contact)}
			isLoading={isLoading}
			onEdit={goToEdit}
			onDelete={handleDelete}
			deleteTitle="Delete contact?"
			deleteDescription={`Contact "${
				contact
					? fullName(contact.first_name, contact.last_name) ||
						contact.email
					: ''
			}" will be deleted.`}
			isDeleting={isDeleting}
			heading={
				contact
					? {
							title:
								fullName(
									contact.first_name,
									contact.last_name,
								) || contact.email,
							subtitle: contact.email,
							badge: contact.is_deleted ? (
								<Badge variant="muted">Deleted</Badge>
							) : (
								<Badge variant="success">Active</Badge>
							),
						}
					: undefined
			}
			fields={
				contact
					? [
							{ label: 'First name', value: contact.first_name },
							{ label: 'Last name', value: contact.last_name },
							{ label: 'Email', value: contact.email },
							{ label: 'Phone', value: contact.phone },
							{ label: 'Address', value: contact.address },
							{
								label: 'Referral type',
								value: contact.referral_type,
							},
							{
								label: 'Relation type',
								value: contact.relation_type,
							},
							{
								label: 'Owner',
								render: contact.user_id ? (
									<Link
										to={`/agents/${contact.user_id}`}
										className="link"
									>
										{contact.owner}
									</Link>
								) : contact.partner_user_id ? (
									<Link
										to={`/partners/${contact.partner_user_id}`}
										className="link"
									>
										{contact.owner}
									</Link>
								) : (
									(contact.owner ?? '—')
								),
							},
							{
								label: 'Referrals sent',
								value: contact.referrals_sent,
							},
							{
								label: 'Referral code',
								value: contact.referral_code ?? '',
							},
							{ label: 'Slug', value: contact.slug },
							{
								label: 'Created',
								value: formatDateTime(contact.date),
							},
							{
								label: 'Deleted at',
								value: contact.deleted_at
									? formatDateTime(contact.deleted_at)
									: '',
							},
						]
					: undefined
			}
		/>
	)
}
