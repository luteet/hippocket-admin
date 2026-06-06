import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Field } from '@/components/Field'
import type { Withdrawal } from '@/types/api'
import {
	useWithdrawalForm,
	type WithdrawalFormValues,
} from './useWithdrawalForm'
import { AgentSelect } from './components/AgentSelect'
import { METHOD_OPTIONS, STATUS_OPTIONS } from './useWithdrawalsPage'

interface Props {
	withdrawal?: Withdrawal | null
	onSuccess: (withdrawal: Withdrawal) => void
	onCancel: () => void
}

export function WithdrawalForm({ withdrawal, onSuccess, onCancel }: Props) {
	const {
		isEdit,
		register,
		errors,
		isPending,
		onSubmit,
		setValue,
		userId,
		method,
		status,
		agentOptions,
		isLoadingAgents,
	} = useWithdrawalForm({ withdrawal, onSuccess })

	return (
		<form onSubmit={onSubmit} className="space-y-6">
			<Field label="Agent" error={errors.user_id?.message}>
				{isEdit ? (
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
						value={userId}
						options={agentOptions}
						loading={isLoadingAgents}
						onChange={(v) =>
							setValue('user_id', v, { shouldValidate: true })
						}
					/>
				)}
			</Field>

			<Field label="Amount" error={errors.amount?.message}>
				<Input
					type="number"
					step="0.01"
					placeholder="100.00"
					{...register('amount', { valueAsNumber: true })}
				/>
			</Field>

			<Field label="Method" error={errors.method?.message}>
				<Select
					value={method}
					onValueChange={(v) =>
						setValue('method', v as WithdrawalFormValues['method'])
					}
				>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{METHOD_OPTIONS.map((o) => (
							<SelectItem key={o.value} value={o.value}>
								{o.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</Field>

			<Field label="Status" error={errors.status?.message}>
				<Select
					value={status}
					onValueChange={(v) =>
						setValue('status', v as WithdrawalFormValues['status'])
					}
				>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{STATUS_OPTIONS.map((o) => (
							<SelectItem key={o.value} value={o.value}>
								{o.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</Field>

			<div className="flex justify-end gap-2 pt-4">
				<Button
					type="button"
					variant="outline"
					className="flex-auto xs:min-w-32 xs:flex-none"
					onClick={onCancel}
				>
					Cancel
				</Button>
				<Button
					type="submit"
					disabled={isPending}
					className="flex-auto xs:min-w-32 xs:flex-none"
				>
					{isPending && (
						<Icon name="loader" className="animate-spin" />
					)}
					Save
				</Button>
			</div>
		</form>
	)
}
