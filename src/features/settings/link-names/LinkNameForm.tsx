import { Input } from '@/components/ui/input'
import { Field } from '@/components/Field'
import type { LinkName } from '@/types/api'
import { FormActions } from '../components/FormActions'
import { useLinkNameForm } from './useLinkNameForm'

interface Props {
	item?: LinkName | null
	onSuccess: () => void
	onCancel: () => void
	onDeleted: () => void
}

export function LinkNameForm({ item, onSuccess, onCancel, onDeleted }: Props) {
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
	} = useLinkNameForm({ item, onSuccess, onDeleted })

	return (
		<form onSubmit={onSubmit} className="space-y-6">
			<Field label="Name" error={errors.name?.message}>
				<Input {...register('name')} />
			</Field>
			<Field label="Link" error={errors.link?.message}>
				<Input
					type="url"
					placeholder="https://example.com"
					{...register('link')}
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
				deleteTitle="Delete link?"
				deleteDescription="This link will be permanently deleted."
			/>
		</form>
	)
}
