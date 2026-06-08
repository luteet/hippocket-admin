import { Input } from '@/components/ui/input'
import { AgentSelect } from '@/components/AgentSelect'
import { FormLayout } from '@/components/form/FormLayout'
import type { FormFieldEntry } from '@/components/form/types'
import type { Withdrawal } from '@/types/api'
import { useWithdrawalForm } from './useWithdrawalForm'
import { METHOD_OPTIONS, STATUS_OPTIONS } from './useWithdrawalsPage'

interface Props {
	withdrawal?: Withdrawal | null
	onSuccess: (withdrawal: Withdrawal) => void
	onCancel: () => void
}

export function WithdrawalForm({ withdrawal, onSuccess, onCancel }: Props) {
	const { isEdit, form, isPending, onSubmit, agentOptions, isLoadingAgents } =
		useWithdrawalForm({ withdrawal, onSuccess })

	const fields: FormFieldEntry[] = [
		{
			type: 'custom',
			label: 'Agent',
			name: 'user_id',
			render: isEdit ? (
				// A withdrawal can't be reassigned — show the agent read-only.
				<Input
					value={
						withdrawal?.user_full_name ||
						withdrawal?.user_email ||
						''
					}
					disabled
				/>
			) : (
				<AgentSelect
					value={form.watch('user_id')}
					options={agentOptions}
					loading={isLoadingAgents}
					onChange={(v) =>
						form.setValue('user_id', v, { shouldValidate: true })
					}
				/>
			),
		},
		{
			type: 'number',
			name: 'amount',
			label: 'Amount',
			step: '0.01',
			placeholder: '100.00',
		},
		{
			type: 'select',
			name: 'method',
			label: 'Method',
			options: METHOD_OPTIONS.map((o) => ({
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
