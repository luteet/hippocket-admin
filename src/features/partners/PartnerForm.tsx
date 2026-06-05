import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
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
import { SectionTitle } from '@/components/SectionTitle'
import { SwitchField } from '@/components/SwitchField'
import type { Partner } from '@/types/api'
import { usePartnerForm, type PartnerFormValues } from './usePartnerForm'
import { RefSelect } from './components/RefSelect'

interface Props {
	partner?: Partner | null
	onSuccess: (partner: Partner) => void
	onCancel: () => void
}

export function PartnerForm({ partner, onSuccess, onCancel }: Props) {
	const {
		isEdit,
		register,
		errors,
		setValue,
		valueType,
		isHide,
		isHideForJourney,
		smsEnabled,
		locationId,
		categoryId,
		serviceId,
		locationOptions,
		categoryOptions,
		serviceOptions,
		handleCreateRef,
		isPending,
		onSubmit,
	} = usePartnerForm({ partner, onSuccess })

	return (
		<form onSubmit={onSubmit} className="space-y-6">
			<Field label="Name" error={errors.name?.message}>
				<Input {...register('name')} />
			</Field>
			<Field label="Email" error={errors.email?.message}>
				<Input type="email" {...register('email')} />
			</Field>
			<Field label="Phone" error={errors.phone?.message}>
				<Input {...register('phone')} />
			</Field>

			<SectionTitle>Details</SectionTitle>
			<Field label="Subtitle" error={errors.subtitle?.message}>
				<Input {...register('subtitle')} />
			</Field>
			<Field
				label="Short description"
				error={errors.short_description?.message}
			>
				<Textarea rows={2} {...register('short_description')} />
			</Field>
			<Field label="Description" error={errors.description?.message}>
				<Textarea rows={4} {...register('description')} />
			</Field>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Field label="Website" error={errors.website?.message}>
					<Input {...register('website')} />
				</Field>
				<Field label="Address" error={errors.address?.message}>
					<Input {...register('address')} />
				</Field>
			</div>
			<Field
				label="Custom keywords"
				error={errors.custom_keywords?.message}
			>
				<Input {...register('custom_keywords')} />
			</Field>

			<SectionTitle>Fees & value</SectionTitle>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Field label="Agent fee" error={errors.agent_fee?.message}>
					<Input
						type="number"
						step="0.01"
						{...register('agent_fee', { valueAsNumber: true })}
					/>
				</Field>
				<Field label="Value type">
					<Select
						value={valueType}
						onValueChange={(v) =>
							setValue(
								'value_type',
								v as PartnerFormValues['value_type'],
							)
						}
						disabled={isEdit}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="money">Money</SelectItem>
							<SelectItem value="tokens">Tokens</SelectItem>
						</SelectContent>
					</Select>
				</Field>
				<Field
					label="Potential value"
					error={errors.potential_value?.message}
				>
					<Input
						type="number"
						step="0.01"
						{...register('potential_value', {
							setValueAs: (v) =>
								v === '' || v == null ? null : Number(v),
						})}
					/>
				</Field>
				<Field
					label="Group owner fee"
					error={errors.group_owner_fee?.message}
				>
					<Input
						type="number"
						step="0.01"
						{...register('group_owner_fee', {
							valueAsNumber: true,
						})}
					/>
				</Field>
				<Field
					label="Hippocket fee"
					error={errors.hippocket_fee?.message}
				>
					<Input
						type="number"
						step="0.01"
						{...register('hippocket_fee', {
							valueAsNumber: true,
						})}
					/>
				</Field>
			</div>

			<SectionTitle>SMS notifications</SectionTitle>
			<SwitchField
				id="sms_notifications_enabled"
				label="Active"
				checked={smsEnabled}
				onCheckedChange={(v) =>
					setValue('sms_notifications_enabled', v)
				}
			/>
			<Field label="Phone" error={errors.sms_phone?.message}>
				<Input {...register('sms_phone')} />
			</Field>

			<SectionTitle>Visibility</SectionTitle>
			<SwitchField
				id="is_hide_for_journey"
				label="Hidden for journey"
				checked={isHideForJourney}
				onCheckedChange={(v) => setValue('is_hide_for_journey', v)}
			/>

			{isEdit && (
				<SwitchField
					id="is_hide"
					label="Hidden"
					checked={isHide}
					onCheckedChange={(v) => setValue('is_hide', v)}
				/>
			)}

			<SectionTitle>Taxonomies</SectionTitle>

			<Field label="Location">
				<RefSelect
					value={locationId}
					options={locationOptions}
					placeholder="Select a location"
					onChange={(v) => setValue('location_id', v)}
					onCreate={handleCreateRef}
				/>
			</Field>
			<Field label="Category">
				<RefSelect
					value={categoryId}
					options={categoryOptions}
					placeholder="Select a category"
					onChange={(v) => setValue('category_id', v)}
					onCreate={handleCreateRef}
				/>
			</Field>
			<Field label="Service">
				<RefSelect
					value={serviceId}
					options={serviceOptions}
					placeholder="Select a service"
					onChange={(v) => setValue('service_id', v)}
					onCreate={handleCreateRef}
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
