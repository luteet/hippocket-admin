import { FormLayout } from '@/components/form/FormLayout'
import type { FormFieldEntry } from '@/components/form/types'
import type { ReferralDetail } from '@/types/api'
import { useReferralForm, VALUE_TYPE_OPTIONS } from './useReferralForm'

interface Props {
	referral?: ReferralDetail | null
	onSuccess: (referral: ReferralDetail) => void
	onCancel: () => void
}

export function ReferralForm({ referral, onSuccess, onCancel }: Props) {
	const {
		form,
		statusOptions,
		partnerOptions,
		groupOptions,
		isPending,
		onSubmit,
	} = useReferralForm({ referral, onSuccess })

	const fields: FormFieldEntry[] = [
		{ type: 'section', title: 'Details', first: true },
		{ type: 'text', name: 'referral_name', label: 'Name' },
		{
			type: 'grid',
			fields: [
				{
					type: 'select',
					name: 'status_id',
					label: 'Status',
					placeholder: 'Select a status',
					options: statusOptions.map((s) => ({
						value: String(s.id),
						label: s.name,
					})),
				},
				{
					type: 'select',
					name: 'referral_group_id',
					label: 'Group',
					placeholder: 'Select a group',
					options: groupOptions.map((g) => ({
						value: String(g.id),
						label: g.name,
					})),
				},
			],
		},
		{
			type: 'select',
			name: 'referral_partner_id',
			label: 'Partner',
			placeholder: 'Select a partner',
			options: partnerOptions.map((p) => ({
				value: p.id,
				label: p.name,
			})),
		},
		{ type: 'text', name: 'contact_id', label: 'Contact ID' },

		{ type: 'section', title: 'Value' },
		{
			type: 'grid',
			fields: [
				{
					type: 'text',
					name: 'potential_value',
					label: 'Potential value',
					placeholder: '$300',
				},
				{
					type: 'select',
					name: 'value_type',
					label: 'Value type',
					options: VALUE_TYPE_OPTIONS.map((o) => ({
						value: o.value,
						label: o.label,
					})),
				},
				{
					type: 'number',
					name: 'agent_potential_value',
					label: 'Agent income',
					step: '0.01',
				},
				{
					type: 'number',
					name: 'partner_potential_value',
					label: 'Partner income',
					step: '0.01',
				},
				{
					type: 'number',
					name: 'coin_course',
					label: 'Coin course',
					step: '0.01',
				},
			],
		},

		{ type: 'section', title: 'Flags' },
		{ type: 'switch', name: 'is_paid', label: 'Paid' },
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
