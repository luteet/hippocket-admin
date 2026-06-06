import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Field } from '@/components/Field'
import { SwitchField } from '@/components/SwitchField'
import type { GroupFormPrice } from '@/types/api'
import { FormActions } from '../components/FormActions'
import { useGroupFormPriceForm } from './useGroupFormPriceForm'

interface Props {
	item?: GroupFormPrice | null
	onSuccess: () => void
	onCancel: () => void
	onDeleted: () => void
}

export function GroupFormPriceForm({
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
		formConfigId,
		groupId,
		isActive,
		formOptions,
		groupOptions,
		onSubmit,
		isPending,
		confirmOpen,
		setConfirmOpen,
		isDeleting,
		handleDelete,
	} = useGroupFormPriceForm({ item, onSuccess, onDeleted })

	return (
		<form onSubmit={onSubmit} className="space-y-6">
			<Field label="Name" error={errors.name?.message}>
				<Input {...register('name')} />
			</Field>
			<Field label="Form" error={errors.form_config_id?.message}>
				<Select
					value={formConfigId || undefined}
					onValueChange={(v) => setValue('form_config_id', v)}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select a form" />
					</SelectTrigger>
					<SelectContent>
						{formOptions.map((o) => (
							<SelectItem key={o.id} value={o.id}>
								{o.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</Field>
			<Field label="Group" error={errors.group_id?.message}>
				<Select
					value={groupId ? String(groupId) : undefined}
					onValueChange={(v) => setValue('group_id', Number(v))}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select a group" />
					</SelectTrigger>
					<SelectContent>
						{groupOptions.map((o) => (
							<SelectItem key={o.id} value={String(o.id)}>
								{o.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</Field>
			<Field label="Price" error={errors.price?.message}>
				<Input
					type="number"
					step="0.01"
					{...register('price', { valueAsNumber: true })}
				/>
			</Field>
			<Field label="Comment" error={errors.comment?.message}>
				<Textarea {...register('comment')} />
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
				deleteTitle="Delete form price?"
				deleteDescription="This group form price will be permanently deleted."
			/>
		</form>
	)
}
