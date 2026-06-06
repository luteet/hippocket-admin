import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import type { FormConfig } from '@/types/api'
import {
	useCreateFormConfig,
	useDeleteFormConfig,
	useUpdateFormConfig,
} from '../hooks'

const schema = z.object({
	name: z.string().min(1, 'Required'),
	slug: z.string().min(1, 'Required'),
	endpoint: z.string().min(1, 'Required'),
	price: z.number({ message: 'Enter a number' }).min(0, 'Cannot be negative'),
	currency: z.string().min(1, 'Required'),
	is_active: z.boolean(),
	description: z.string(),
})

export type FormConfigFormValues = z.infer<typeof schema>

function defaults(item?: FormConfig | null): FormConfigFormValues {
	return {
		name: item?.name ?? '',
		slug: item?.slug ?? '',
		endpoint: item?.endpoint ?? '',
		price: item?.price ?? 0,
		currency: item?.currency ?? 'USD',
		is_active: item?.is_active ?? true,
		description: item?.description ?? '',
	}
}

interface Params {
	item?: FormConfig | null
	onSuccess: () => void
	onDeleted: () => void
}

export function useFormConfigForm({ item, onSuccess, onDeleted }: Params) {
	const isEdit = !!item
	const createMut = useCreateFormConfig()
	const updateMut = useUpdateFormConfig()
	const deleteMut = useDeleteFormConfig()
	const [confirmOpen, setConfirmOpen] = useState(false)

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		watch,
		formState: { errors },
	} = useForm<FormConfigFormValues>({
		resolver: zodResolver(schema),
		defaultValues: defaults(item),
	})

	useEffect(() => {
		if (item) reset(defaults(item))
	}, [item, reset])

	const isActive = watch('is_active')

	const onSubmit = handleSubmit(async (values) => {
		try {
			if (isEdit && item) {
				// Slug is the form's identifier — not part of the update DTO.
				await updateMut.mutateAsync({
					id: item.id,
					dto: {
						name: values.name,
						endpoint: values.endpoint,
						price: values.price,
						currency: values.currency,
						is_active: values.is_active,
						description: values.description,
					},
				})
				toast.success('Form updated')
			} else {
				await createMut.mutateAsync(values)
				toast.success('Form created')
			}
			onSuccess()
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to save'))
		}
	})

	const handleDelete = async () => {
		if (!item) return
		try {
			await deleteMut.mutateAsync(item.id)
			toast.success('Form deleted')
			onDeleted()
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to delete'))
		}
	}

	return {
		isEdit,
		register,
		errors,
		setValue,
		isActive,
		onSubmit,
		isPending: createMut.isPending || updateMut.isPending,
		confirmOpen,
		setConfirmOpen,
		isDeleting: deleteMut.isPending,
		handleDelete,
	}
}
