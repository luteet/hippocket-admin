import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { FormLayout } from '@/components/form/FormLayout'
import type { FormFieldEntry } from '@/components/form/types'
import type { Agent } from '@/types/api'
import { ROLE_OPTIONS, STATUS_OPTIONS } from './useAgentsPage'
import { useAgentForm } from './useAgentForm'
import { GroupMultiSelect } from './components/GroupMultiSelect'

interface Props {
	agent?: Agent | null
	onSuccess: (agent: Agent) => void
	onCancel: () => void
}

export function AgentForm({ agent, onSuccess, onCancel }: Props) {
	const {
		isEdit,
		form,
		groupIds,
		chosenGroupId,
		toggleGroup,
		setChosenGroup,
		groupOptions,
		isPending,
		onSubmit,
	} = useAgentForm({ agent, onSuccess })

	// The chosen (primary) group must be one of the selected memberships.
	const chosenOptions = groupOptions.filter((g) => groupIds.includes(g.id))

	const fields: FormFieldEntry[] = [
		{ type: 'section', title: 'Account', first: true },
		{
			type: 'email',
			name: 'email',
			label: 'Email',
			disabled: isEdit,
		},
		isEdit && {
			type: 'email',
			name: 'pending_email',
			label: 'New email',
			placeholder: 'Pending — applied after the agent confirms it',
		},
		{
			type: 'password',
			name: 'password',
			label: isEdit ? 'New password' : 'Password',
			autoComplete: 'new-password',
			placeholder: isEdit ? 'Leave blank to keep current' : undefined,
		},
		{ type: 'text', name: 'username', label: 'Username' },
		{
			type: 'grid',
			fields: [
				{ type: 'text', name: 'first_name', label: 'First name' },
				{ type: 'text', name: 'last_name', label: 'Last name' },
			],
		},
		{ type: 'text', name: 'phone', label: 'Phone' },
		{
			type: 'grid',
			fields: [
				{ type: 'text', name: 'company', label: 'Company' },
				{ type: 'text', name: 'address', label: 'Address' },
			],
		},

		{ type: 'section', title: 'Classification' },
		{
			type: 'grid',
			fields: [
				{
					type: 'select',
					name: 'role',
					label: 'Role',
					options: ROLE_OPTIONS.map((o) => ({
						value: o.value,
						label: o.label,
					})),
				},
				{
					type: 'select',
					name: 'status',
					label: 'Status',
					options: STATUS_OPTIONS.map((o) => ({
						value: o.value,
						label: o.label,
					})),
				},
			],
		},
		{
			type: 'custom',
			label: 'Groups',
			render: (
				<GroupMultiSelect
					options={groupOptions}
					selected={groupIds}
					onToggle={toggleGroup}
				/>
			),
		},
		{
			type: 'custom',
			label: 'Chosen group',
			render: (
				<div className="relative">
					<Select
						value={chosenGroupId || undefined}
						onValueChange={setChosenGroup}
						disabled={chosenOptions.length === 0}
					>
						<SelectTrigger
							className={
								chosenGroupId ? '[&>span]:pr-8' : undefined
							}
						>
							<SelectValue
								placeholder={
									chosenOptions.length === 0
										? 'Select groups first'
										: 'Select a chosen group'
								}
							/>
						</SelectTrigger>
						<SelectContent>
							{chosenOptions.map((g) => (
								<SelectItem key={g.id} value={String(g.id)}>
									{g.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			),
		},

		{ type: 'section', title: 'Balance' },
		{
			type: 'grid',
			fields: [
				{
					type: 'number',
					name: 'balance',
					label: 'Balance ($)',
					step: '0.01',
				},
				{
					type: 'number',
					name: 'balance_coin',
					label: 'Token balance',
					step: '0.01',
				},
			],
		},

		{ type: 'section', title: 'Payment methods' },
		{
			type: 'grid',
			fields: [
				{ type: 'text', name: 'paypal_data', label: 'PayPal' },
				{ type: 'text', name: 'venmo_id', label: 'Venmo' },
				{ type: 'text', name: 'cash_app_info', label: 'Cash App' },
				{ type: 'text', name: 'zelle', label: 'Zelle' },
			],
		},
		{ type: 'text', name: 'license_number', label: 'License number' },

		{ type: 'section', title: 'Flags' },
		{ type: 'switch', name: 'is_active', label: 'Active' },
		{ type: 'switch', name: 'is_new_user', label: 'New user' },
		!isEdit && { type: 'switch', name: 'is_hide', label: 'Hidden' },
		!isEdit && {
			type: 'switch',
			name: 'default_admin',
			label: 'Default admin',
		},
	]

	return (
		<FormLayout
			form={form}
			fields={fields}
			onSubmit={onSubmit}
			onCancel={onCancel}
			isPending={isPending}
		/>
	)
}
