import { AgentSelect } from '@/components/AgentSelect'
import { FormLayout } from '@/components/form/FormLayout'
import type { FormFieldEntry } from '@/components/form/types'
import type { Contact } from '@/types/api'
import { useContactForm } from './useContactForm'

interface Props {
	contact?: Contact | null
	onSuccess: (contact: Contact) => void
	onCancel: () => void
}

export function ContactForm({ contact, onSuccess, onCancel }: Props) {
	const { isEdit, form, agentRefs, agentsLoading, isPending, onSubmit } =
		useContactForm({ contact, onSuccess })

	const fields: FormFieldEntry[] = [
		{ type: 'section', title: 'Contact', first: true },
		{
			type: 'grid',
			fields: [
				{ type: 'text', name: 'first_name', label: 'First name' },
				{ type: 'text', name: 'last_name', label: 'Last name' },
			],
		},
		{ type: 'email', name: 'email', label: 'Email' },
		{ type: 'text', name: 'phone', label: 'Phone' },
		{ type: 'text', name: 'address', label: 'Address' },

		{ type: 'section', title: 'Classification' },
		{
			type: 'grid',
			fields: [
				{
					type: 'text',
					name: 'referral_type',
					label: 'Referral type',
					placeholder: 'e.g. Real Estate',
				},
				{
					type: 'text',
					name: 'relation_type',
					label: 'Relation type',
					placeholder: 'e.g. Friend',
				},
			],
		},

		// The owning agent can only be set at creation — it isn't part of the
		// update payload, so on edit we show it read-only instead.
		!isEdit && { type: 'section', title: 'Owner' },
		!isEdit && {
			type: 'custom',
			label: 'Owner',
			name: 'user_id',
			render: (
				<AgentSelect
					value={form.watch('user_id')}
					options={agentRefs}
					loading={agentsLoading}
					onChange={(v) => form.setValue('user_id', v)}
				/>
			),
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
