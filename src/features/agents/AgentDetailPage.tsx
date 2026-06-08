import { Badge } from '@/components/ui/badge'
import { DetailPage } from '@/components/detail/DetailPage'
import { useAgentDetailPage } from './useAgentDetailPage'
import { chosenGroupName, formatDateTime, fullName } from './format'

export function AgentDetailPage() {
	const { agent, isLoading, isDeleting, handleDelete, goBack, goToEdit } =
		useAgentDetailPage()

	return (
		<DetailPage
			title="Agent"
			onBack={goBack}
			ready={Boolean(agent)}
			isLoading={isLoading}
			onEdit={goToEdit}
			onDelete={handleDelete}
			deleteTitle="Delete agent?"
			deleteDescription={`Agent "${agent?.email ?? ''}" will be permanently deleted.`}
			isDeleting={isDeleting}
			heading={
				agent
					? {
							title:
								fullName(agent.first_name, agent.last_name) ||
								agent.email,
							subtitle: agent.email,
							badge: agent.is_active ? (
								<Badge variant="success">Active</Badge>
							) : (
								<Badge variant="muted">Inactive</Badge>
							),
						}
					: undefined
			}
			fields={
				agent
					? [
							{ label: 'Username', value: agent.username },
							{ label: 'Phone', value: agent.phone },
							{
								label: 'Role',
								value: agent.role,
								capitalize: true,
							},
							{
								label: 'Status',
								value: agent.status,
								capitalize: true,
							},
							{ label: 'Company', value: agent.company },
							{ label: 'Address', value: agent.address },
							{
								label: 'Groups',
								value: agent.group_names.join(', '),
							},
							{
								label: 'Chosen group',
								value: chosenGroupName(agent),
							},
							{
								label: 'Balance',
								value: `$${agent.balance.toFixed(2)}`,
							},
							{
								label: 'Token balance',
								value: agent.balance_coin,
							},
							{
								label: 'Referral code',
								value: agent.referral_code ?? '',
							},
							{
								label: 'License number',
								value: agent.license_number,
							},
							{ label: 'PayPal', value: agent.paypal_data },
							{ label: 'Venmo', value: agent.venmo_id },
							{ label: 'Cash App', value: agent.cash_app_info },
							{ label: 'Zelle', value: agent.zelle },
							{ label: 'New user', bool: agent.is_new_user },
							{
								label: 'Default admin',
								bool: agent.default_admin,
							},
							{ label: 'Hidden', bool: agent.is_hide },
							{ label: 'Logins', value: agent.count_login },
							{
								label: 'Pending email',
								value: agent.pending_email ?? '',
							},
							{
								label: 'Last login',
								value: formatDateTime(agent.last_login),
							},
							{
								label: 'Created',
								value: formatDateTime(agent.created_at),
							},
							{
								label: 'Updated',
								value: formatDateTime(agent.updated_at),
							},
						]
					: undefined
			}
		/>
	)
}
