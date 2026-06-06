import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field } from '@/components/Field'
import { SwitchField } from '@/components/SwitchField'
import type { FormConfig } from '@/types/api'
import { FormActions } from '../components/FormActions'
import { useFormConfigForm } from './useFormConfigForm'

interface Props {
	item?: FormConfig | null
	onSuccess: () => void
	onCancel: () => void
	onDeleted: () => void
}

export function FormConfigForm({
	item,
	onSuccess,
	onCancel,
	onDeleted,
}: Props) {
	const {
		isEdit,
		register,
		errors,
		setValue,
		isActive,
		onSubmit,
		isPending,
		confirmOpen,
		setConfirmOpen,
		isDeleting,
		handleDelete,
	} = useFormConfigForm({ item, onSuccess, onDeleted })

	return (
		<form onSubmit={onSubmit} className="space-y-6">
			<Field label="Name" error={errors.name?.message}>
				<Input {...register('name')} />
			</Field>
			<Field label="Slug" error={errors.slug?.message}>
				<Input
					disabled={isEdit}
					placeholder="make-an-offer"
					{...register('slug')}
				/>
			</Field>
			<Field label="Endpoint" error={errors.endpoint?.message}>
				<Input placeholder="/api/forms/..." {...register('endpoint')} />
			</Field>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Field label="Price" error={errors.price?.message}>
					<Input
						type="number"
						step="0.01"
						{...register('price', { valueAsNumber: true })}
					/>
				</Field>
				<Field label="Currency" error={errors.currency?.message}>
					<Input {...register('currency')} />
				</Field>
			</div>
			<Field label="Description" error={errors.description?.message}>
				<Textarea {...register('description')} />
			</Field>
			<SwitchField
				id="is_active"
				label="Active"
				checked={isActive}
				onCheckedChange={(v) => setValue('is_active', v)}
			/>

			<FormActions
				isEdit={isEdit}
				isPending={isPending}
				isDeleting={isDeleting}
				confirmOpen={confirmOpen}
				setConfirmOpen={setConfirmOpen}
				onDelete={handleDelete}
				onCancel={onCancel}
				deleteTitle="Delete form?"
				deleteDescription="This form configuration will be permanently deleted."
			/>
		</form>
	)
}
