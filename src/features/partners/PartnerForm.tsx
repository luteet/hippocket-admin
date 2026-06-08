import { FormLayout } from '@/components/form/FormLayout'
import type { FormFieldEntry } from '@/components/form/types'
import type { Partner } from '@/types/api'
import { usePartnerForm } from './usePartnerForm'
import { RefSelect } from './components/RefSelect'

interface Props {
	partner?: Partner | null
	onSuccess: (partner: Partner) => void
	onCancel: () => void
}

export function PartnerForm({ partner, onSuccess, onCancel }: Props) {
	const {
		isEdit,
		form,
		handleCreateRef,
		locationOptions,
		categoryOptions,
		serviceOptions,
		isPending,
		onSubmit,
	} = usePartnerForm({ partner, onSuccess })

	const fields: FormFieldEntry[] = [
		{ type: 'text', name: 'name', label: 'Name' },
		{ type: 'email', name: 'email', label: 'Email' },
		{ type: 'text', name: 'phone', label: 'Phone' },

		{ type: 'section', title: 'Details' },
		{ type: 'text', name: 'subtitle', label: 'Subtitle' },
		{
			type: 'textarea',
			name: 'short_description',
			label: 'Short description',
			rows: 2,
		},
		{
			type: 'textarea',
			name: 'description',
			label: 'Description',
			rows: 4,
		},
		{
			type: 'grid',
			fields: [
				{ type: 'text', name: 'website', label: 'Website' },
				{ type: 'text', name: 'address', label: 'Address' },
			],
		},
		{ type: 'text', name: 'custom_keywords', label: 'Custom keywords' },

		{ type: 'section', title: 'Fees & value' },
		{
			type: 'grid',
			fields: [
				{
					type: 'number',
					name: 'agent_fee',
					label: 'Agent fee',
					step: '0.01',
				},
				{
					type: 'select',
					name: 'value_type',
					label: 'Value type',
					disabled: isEdit,
					options: [
						{ value: 'money', label: 'Money' },
						{ value: 'tokens', label: 'Tokens' },
					],
				},
				{
					type: 'number',
					name: 'potential_value',
					label: 'Potential value',
					step: '0.01',
					registerOptions: {
						setValueAs: (v) =>
							v === '' || v == null ? null : Number(v),
					},
				},
				{
					type: 'number',
					name: 'group_owner_fee',
					label: 'Group owner fee',
					step: '0.01',
				},
				{
					type: 'number',
					name: 'hippocket_fee',
					label: 'Hippocket fee',
					step: '0.01',
				},
			],
		},

		{ type: 'section', title: 'SMS notifications' },
		{
			type: 'switch',
			name: 'sms_notifications_enabled',
			label: 'Active',
		},
		{ type: 'text', name: 'sms_phone', label: 'Phone' },

		{ type: 'section', title: 'Visibility' },
		{
			type: 'switch',
			name: 'is_hide_for_journey',
			label: 'Hidden for journey',
		},
		isEdit && { type: 'switch', name: 'is_hide', label: 'Hidden' },

		{ type: 'section', title: 'Taxonomies' },
		{
			type: 'custom',
			label: 'Location',
			render: (
				<RefSelect
					value={form.watch('location_id')}
					options={locationOptions}
					placeholder="Select a location"
					onChange={(v) => form.setValue('location_id', v)}
					onCreate={handleCreateRef}
				/>
			),
		},
		{
			type: 'custom',
			label: 'Category',
			render: (
				<RefSelect
					value={form.watch('category_id')}
					options={categoryOptions}
					placeholder="Select a category"
					onChange={(v) => form.setValue('category_id', v)}
					onCreate={handleCreateRef}
				/>
			),
		},
		{
			type: 'custom',
			label: 'Service',
			render: (
				<RefSelect
					value={form.watch('service_id')}
					options={serviceOptions}
					placeholder="Select a service"
					onChange={(v) => form.setValue('service_id', v)}
					onCreate={handleCreateRef}
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
