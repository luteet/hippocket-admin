import { FormLayout } from '@/components/form/FormLayout'
import type { FormFieldEntry } from '@/components/form/types'
import type { SharedPartner } from '@/types/api'
import { useSharedPartnerForm } from './useSharedPartnerForm'

interface Props {
	shared?: SharedPartner | null
	onSuccess: (shared: SharedPartner) => void
	onCancel: () => void
}

export function SharedPartnerForm({ shared, onSuccess, onCancel }: Props) {
	const {
		form,
		agentOptions,
		agentsLoading,
		onAgentSearch,
		selectedAgentLabel,
		isPending,
		onSubmit,
	} = useSharedPartnerForm({ shared, onSuccess })

	const fields: FormFieldEntry[] = [
		{
			type: 'select',
			name: 'agent_email',
			label: 'Agent',
			searchable: true,
			options: agentOptions,
			placeholder: 'Select an agent',
			searchPlaceholder: 'Search agents…',
			onSearch: onAgentSearch,
			loading: agentsLoading,
			selectedLabel: selectedAgentLabel,
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
