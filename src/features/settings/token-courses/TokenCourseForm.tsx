import { FormLayout } from '@/components/form/FormLayout'
import type { FormFieldEntry } from '@/components/form/types'
import type { TokenCourse } from '@/types/api'
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
	const { isEdit, form, onSubmit, isPending, isDeleting, handleDelete } =
		useTokenCourseForm({ item, onSuccess, onDeleted })

	const fields: FormFieldEntry[] = [
		{
			type: 'number',
			name: 'coin_to_money',
			label: 'Token → money rate',
			step: '0.01',
		},
	]

	return (
		<FormLayout
			form={form}
			fields={fields}
			onSubmit={onSubmit}
			onCancel={onCancel}
			isPending={isPending}
			isEdit={isEdit}
			onDelete={handleDelete}
			isDeleting={isDeleting}
			deleteTitle="Delete token course?"
			deleteDescription="This conversion rate will be permanently deleted."
		/>
	)
}
