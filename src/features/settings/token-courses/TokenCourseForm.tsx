import { Input } from '@/components/ui/input'
import { Field } from '@/components/Field'
import type { TokenCourse } from '@/types/api'
import { FormActions } from '../components/FormActions'
import { useTokenCourseForm } from './useTokenCourseForm'

interface Props {
	item?: TokenCourse | null
	onSuccess: () => void
	onCancel: () => void
	onDeleted: () => void
}

export function TokenCourseForm({
	item,
	onSuccess,
	onCancel,
	onDeleted,
}: Props) {
	const {
		isEdit,
		register,
		errors,
		onSubmit,
		isPending,
		confirmOpen,
		setConfirmOpen,
		isDeleting,
		handleDelete,
	} = useTokenCourseForm({ item, onSuccess, onDeleted })

	return (
		<form onSubmit={onSubmit} className="space-y-6">
			<Field
				label="Token → money rate"
				error={errors.coin_to_money?.message}
			>
				<Input
					type="number"
					step="0.01"
					{...register('coin_to_money', { valueAsNumber: true })}
				/>
			</Field>

			<FormActions
				isEdit={isEdit}
				isPending={isPending}
				isDeleting={isDeleting}
				confirmOpen={confirmOpen}
				setConfirmOpen={setConfirmOpen}
				onDelete={handleDelete}
				onCancel={onCancel}
				deleteTitle="Delete token course?"
				deleteDescription="This conversion rate will be permanently deleted."
			/>
		</form>
	)
}
