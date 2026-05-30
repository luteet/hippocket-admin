import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

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
import { getApiErrorMessage } from '@/lib/api/client'
import type { Partner } from '@/types/api'
import { useCreatePartner, useUpdatePartner } from './hooks'

const schema = z.object({
	name: z.string().min(1, 'Enter a name'),
	email: z.string().email('Invalid email'),
	phone: z.string().optional(),
	agent_fee: z
		.number({ message: 'Enter a number' })
		.min(0, 'Cannot be negative'),
	value_type: z.enum(['money', 'coin']),
	is_hide: z.boolean(),
	location_id: z.string().optional(),
	category_id: z.string().optional(),
	service_id: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
	partner?: Partner | null
	onSuccess: (partner: Partner) => void
	onCancel: () => void
}

export function PartnerForm({ partner, onSuccess, onCancel }: Props) {
	const isEdit = !!partner
	const createMut = useCreatePartner()
	const updateMut = useUpdatePartner()

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		watch,
		formState: { errors },
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: partner?.name ?? '',
			email: partner?.email ?? '',
			phone: partner?.phone ?? '',
			agent_fee: partner?.agent_fee ?? 0,
			value_type: partner?.value_type ?? 'money',
			is_hide: partner?.is_hide ?? false,
			location_id: '',
			category_id: '',
			service_id: '',
		},
	})

	// The edit page loads the partner asynchronously — sync the form once it arrives.
	React.useEffect(() => {
		if (partner) {
			reset({
				name: partner.name,
				email: partner.email,
				phone: partner.phone,
				agent_fee: partner.agent_fee,
				value_type: partner.value_type,
				is_hide: partner.is_hide,
				location_id: '',
				category_id: '',
				service_id: '',
			})
		}
	}, [partner, reset])

	const valueType = watch('value_type')
	const isHide = watch('is_hide')

	const onSubmit = async (values: FormValues) => {
		try {
			if (isEdit && partner) {
				const updated = await updateMut.mutateAsync({
					id: partner.id,
					dto: {
						name: values.name,
						email: values.email,
						phone: values.phone,
						agent_fee: values.agent_fee,
						is_hide: values.is_hide,
					},
				})
				toast.success('Partner updated')
				onSuccess(updated)
			} else {
				const created = await createMut.mutateAsync({
					name: values.name,
					email: values.email,
					phone: values.phone,
					agent_fee: values.agent_fee,
					value_type: values.value_type,
					location_id: values.location_id || undefined,
					category_id: values.category_id || undefined,
					service_id: values.service_id || undefined,
				})
				toast.success('Partner created')
				onSuccess(created)
			}
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to save'))
		}
	}

	const isPending = createMut.isPending || updateMut.isPending

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
								v as FormValues['value_type'],
							)
						}
						disabled={isEdit}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="money">Money</SelectItem>
							<SelectItem value="coin">Coins</SelectItem>
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
	children: React.ReactNode
}) {
	return (
		<div className="space-y-2">
			<Label>{label}</Label>
			{children}
			{error && <p className="text-xs text-destructive">{error}</p>}
		</div>
	)
}
