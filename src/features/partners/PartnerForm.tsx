import { type ReactNode } from 'react'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import type { Partner, RefOption } from '@/types/api'
import { usePartnerForm, type PartnerFormValues } from './usePartnerForm'

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
				<Button type="button" variant="outline" className="flex-auto xs:flex-none" onClick={onCancel}>
					Cancel
				</Button>
				<Button type="submit" disabled={isPending} className="flex-auto xs:flex-none">
					{isPending && (
						<Icon name="loader" className="animate-spin" />
					)}
					Save
				</Button>
			</div>
		</form>
	)
}

function RefSelect({
	value,
	options,
	placeholder,
	onChange,
	onCreate,
}: {
	value?: string
	options: RefOption[]
	placeholder: string
	onChange: (value: string) => void
	onCreate: () => void
}) {
	return (
		<div className="flex gap-2">
			<div className="relative flex-1">
				<Select value={value || undefined} onValueChange={onChange}>
					<SelectTrigger
						className={value ? '[&>span]:pr-8' : undefined}
					>
						<SelectValue placeholder={placeholder} />
					</SelectTrigger>
					<SelectContent>
						{options.map((o) => (
							<SelectItem key={o.id} value={o.id}>
								{o.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{value && (
					<button
						type="button"
						aria-label="Clear selection"
						onPointerDown={(e) => e.stopPropagation()}
						onClick={(e) => {
							e.stopPropagation()
							onChange('')
						}}
						className="absolute right-8 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground hover:text-foreground"
					>
						<Icon name="x" className="size-4" />
					</button>
				)}
			</div>
			<Button
				type="button"
				variant="outline"
				size="icon"
				className="h-10 sm2:h-14"
				aria-label="Create new option"
				onClick={onCreate}
			>
				<Icon name="plus" className="size-4" />
			</Button>
		</div>
	)
}

function SectionTitle({ children }: { children: ReactNode }) {
	return (
		<div className="space-y-8 pt-6">
			<Separator />
			<p className="text-lg font-medium text-muted-foreground">
				{children}
			</p>
		</div>
	)
}

function SwitchField({
	id,
	label,
	checked,
	onCheckedChange,
}: {
	id: string
	label: string
	checked: boolean
	onCheckedChange: (checked: boolean) => void
}) {
	return (
		<Label
			htmlFor={id}
			className="flex cursor-pointer items-center justify-between rounded-md border border-border p-4 text-sm"
		>
			{label}
			<Switch
				id={id}
				checked={checked}
				onCheckedChange={onCheckedChange}
			/>
		</Label>
	)
}

function Field({
	label,
	error,
	children,
}: {
	label: string
	error?: string
	children: ReactNode
}) {
	return (
		<div className="space-y-3">
			<Label>{label}</Label>
			{children}
			{error && <p className="text-xs text-destructive">{error}</p>}
		</div>
	)
}
