import { FormLayout } from '@/components/form/FormLayout'
import type { FormFieldEntry } from '@/components/form/types'
import type { Transaction } from '@/types/api'
import { usePartnerConnectForm } from './usePartnerConnectForm'

interface Props {
	transaction?: Transaction | null
	onSuccess: (transaction: Transaction) => void
	onCancel: () => void
}

export function PartnerConnectForm({
	transaction,
	onSuccess,
	onCancel,
}: Props) {
	const { isEdit, form, isPending, onSubmit } = usePartnerConnectForm({
		transaction,
		onSuccess,
	})

	const fields: FormFieldEntry[] = [
		{ type: 'section', title: 'Partner Connect details', first: true },
		{ type: 'text', name: 'property_address', label: 'Property address' },
		{
			type: 'grid',
			fields: [
				{
					type: 'select',
					name: 'role',
					label: 'Role',
					options: [
						{ value: 'Buyer', label: 'Buyer' },
						{ value: 'Seller', label: 'Seller' },
					],
				},
				{ type: 'text', name: 'customer_name', label: 'Customer name' },
			],
		},
		{
			type: 'grid',
			fields: [
				{
					type: 'text',
					name: 'contract_date',
					label: 'Contract date',
					placeholder: 'YYYY-MM-DD',
				},
				{
					type: 'text',
					name: 'closing_date',
					label: 'Closing date',
					placeholder: 'YYYY-MM-DD',
				},
			],
		},
		{
			type: 'grid',
			fields: [
				{ type: 'text', name: 'agent_id', label: 'Agent ID' },
				{
					type: 'text',
					name: 'agent_display_name',
					label: 'Agent display name',
				},
			],
		},
	]

	return (
		<FormLayout
			form={form}
			fields={fields}
			onSubmit={onSubmit}
			onCancel={onCancel}
			isPending={isPending}
			submitLabel={isEdit ? 'Save' : 'Create'}
		/>
	)
}
