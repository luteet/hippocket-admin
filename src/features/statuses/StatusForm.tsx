import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field } from '@/components/Field'
import type { Status } from '@/types/api'
import { useStatusForm } from './useStatusForm'

interface Props {
	status?: Status | null
	onSuccess: (status: Status) => void
	onCancel: () => void
}

export function StatusForm({ status, onSuccess, onCancel }: Props) {
	const { register, errors, isPending, onSubmit } = useStatusForm({
		status,
		onSuccess,
	})

	return (
		<form onSubmit={onSubmit} className="space-y-6">
			<Field label="Name" error={errors.name?.message}>
				<Input placeholder="On Hold" {...register('name')} />
			</Field>
			<Field label="Label" error={errors.label?.message}>
				<Input placeholder="on_hold" {...register('label')} />
			</Field>
			<Field label="Priority" error={errors.priority?.message}>
				<Input
					type="number"
					placeholder="25"
					{...register('priority', { valueAsNumber: true })}
				/>
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
