import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

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
	value_type: z.enum(['money', 'tokens']),
	is_hide: z.boolean(),
	location_id: z.string().optional(),
	category_id: z.string().optional(),
	service_id: z.string().optional(),
})

export type PartnerFormValues = z.infer<typeof schema>

interface Params {
	partner?: Partner | null
	onSuccess: (partner: Partner) => void
}

export function usePartnerForm({ partner, onSuccess }: Params) {
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
	} = useForm<PartnerFormValues>({
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
	useEffect(() => {
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

	const onSubmit = handleSubmit(async (values) => {
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
	})

	const isPending = createMut.isPending || updateMut.isPending

	return {
		isEdit,
		register,
		errors,
		setValue,
		valueType,
		isHide,
		isPending,
		onSubmit,
	}
}
