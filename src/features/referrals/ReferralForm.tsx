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
import { SectionTitle } from '@/components/SectionTitle'
import { SwitchField } from '@/components/SwitchField'
import type { ReferralDetail } from '@/types/api'
import {
	useReferralForm,
	VALUE_TYPE_OPTIONS,
	type ReferralFormValues,
} from './useReferralForm'

interface Props {
	referral?: ReferralDetail | null
	onSuccess: (referral: ReferralDetail) => void
	onCancel: () => void
}

export function ReferralForm({ referral, onSuccess, onCancel }: Props) {
	const {
		register,
		errors,
		setValue,
		statusId,
		groupId,
		partnerId,
		valueType,
		isPaid,
		statusOptions,
		partnerOptions,
		groupOptions,
		isPending,
		onSubmit,
	} = useReferralForm({ referral, onSuccess })

	return (
		<form onSubmit={onSubmit} className="space-y-6">
			<SectionTitle first>Details</SectionTitle>
			<Field label="Name" error={errors.referral_name?.message}>
				<Input {...register('referral_name')} />
			</Field>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Field label="Status" error={errors.status_id?.message}>
					<Select
						value={statusId || undefined}
						onValueChange={(v) => setValue('status_id', v)}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select a status" />
						</SelectTrigger>
						<SelectContent>
							{statusOptions.map((s) => (
								<SelectItem key={s.id} value={String(s.id)}>
									{s.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</Field>
				<Field label="Group" error={errors.referral_group_id?.message}>
					<Select
						value={groupId || undefined}
						onValueChange={(v) => setValue('referral_group_id', v)}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select a group" />
						</SelectTrigger>
						<SelectContent>
							{groupOptions.map((g) => (
								<SelectItem key={g.id} value={String(g.id)}>
									{g.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</Field>
			</div>
			<Field label="Partner" error={errors.referral_partner_id?.message}>
				<Select
					value={partnerId || undefined}
					onValueChange={(v) => setValue('referral_partner_id', v)}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select a partner" />
					</SelectTrigger>
					<SelectContent>
						{partnerOptions.map((p) => (
							<SelectItem key={p.id} value={p.id}>
								{p.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</Field>
			<Field label="Contact ID" error={errors.contact_id?.message}>
				<Input {...register('contact_id')} />
			</Field>

			<SectionTitle>Value</SectionTitle>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Field
					label="Potential value"
					error={errors.potential_value?.message}
				>
					<Input
						placeholder="$300"
						{...register('potential_value')}
					/>
				</Field>
				<Field label="Value type">
					<Select
						value={valueType}
						onValueChange={(v) =>
							setValue(
								'value_type',
								v as ReferralFormValues['value_type'],
							)
						}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{VALUE_TYPE_OPTIONS.map((o) => (
								<SelectItem key={o.value} value={o.value}>
									{o.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</Field>
				<Field
					label="Agent income"
					error={errors.agent_potential_value?.message}
				>
					<Input
						type="number"
						step="0.01"
						{...register('agent_potential_value', {
							valueAsNumber: true,
						})}
					/>
				</Field>
				<Field
					label="Partner income"
					error={errors.partner_potential_value?.message}
				>
					<Input
						type="number"
						step="0.01"
						{...register('partner_potential_value', {
							valueAsNumber: true,
						})}
					/>
				</Field>
				<Field label="Coin course" error={errors.coin_course?.message}>
					<Input
						type="number"
						step="0.01"
						{...register('coin_course', { valueAsNumber: true })}
					/>
				</Field>
			</div>

			<SectionTitle>Flags</SectionTitle>
			<SwitchField
				id="is_paid"
				label="Paid"
				checked={isPaid}
				onCheckedChange={(v) => setValue('is_paid', v)}
			/>

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
