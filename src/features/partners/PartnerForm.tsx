import { type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import type { Partner } from '@/types/api'
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
		isPending,
		onSubmit,
	} = usePartnerForm({ partner, onSuccess })

	return (
		<form onSubmit={onSubmit} className="space-y-4">
			<Field label="Name" error={errors.name?.message}>
				<Input {...register('name')} />
			</Field>
			<Field label="Email" error={errors.email?.message}>
				<Input type="email" {...register('email')} />
			</Field>
			<Field label="Phone" error={errors.phone?.message}>
				<Input {...register('phone')} />
			</Field>

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
			</div>

			{isEdit ? (
				<div className="flex items-center justify-between rounded-md border border-border p-3">
					<Label htmlFor="is_hide">Hidden</Label>
					<Switch
						id="is_hide"
						checked={isHide}
						onCheckedChange={(v) => setValue('is_hide', v)}
					/>
				</div>
			) : (
				<div className="space-y-4 rounded-md border border-dashed border-border p-3">
					<p className="text-xs text-muted-foreground">
						Location / category / service IDs. The API has no
						reference endpoints yet — entered manually (see the
						backend questions).
					</p>
					<Field label="Location ID">
						<Input {...register('location_id')} />
					</Field>
					<Field label="Category ID">
						<Input {...register('category_id')} />
					</Field>
					<Field label="Service ID">
						<Input {...register('service_id')} />
					</Field>
				</div>
			)}

			<div className="flex justify-end gap-2">
				<Button type="button" variant="outline" onClick={onCancel}>
					Cancel
				</Button>
				<Button type="submit" disabled={isPending}>
					{isPending && <Loader2 className="animate-spin" />}
					Save
				</Button>
			</div>
		</form>
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
		<div className="space-y-2">
			<Label>{label}</Label>
			{children}
			{error && <p className="text-xs text-destructive">{error}</p>}
		</div>
	)
}
