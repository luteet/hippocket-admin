import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import type { GroupFormPrice } from '@/types/api'
import { useGroupOptions } from '@/features/agents/hooks'
import {
	useCreateGroupFormPrice,
	useDeleteGroupFormPrice,
	useFormConfigOptions,
	useUpdateGroupFormPrice,
} from '../hooks'

const schema = z.object({
	name: z.string().min(1, 'Required'),
	form_config_id: z.string().min(1, 'Select a form'),
	// 0 means "not selected" — the Select works with strings.
	group_id: z.number().int().positive('Select a group'),
	price: z.number({ message: 'Enter a number' }).min(0, 'Cannot be negative'),
	comment: z.string(),
	is_active: z.boolean(),
})

export type GroupFormPriceFormValues = z.infer<typeof schema>

function defaults(item?: GroupFormPrice | null): GroupFormPriceFormValues {
	return {
		name: item?.name ?? '',
		form_config_id: item?.form_config_id ?? '',
		group_id: item?.group_id ?? 0,
		price: item?.price ?? 0,
		comment: item?.comment ?? '',
		is_active: item?.is_active ?? true,
	}
}

interface Params {
	item?: GroupFormPrice | null
	onSuccess: () => void
	onDeleted: () => void
}

export function useGroupFormPriceForm({ item, onSuccess, onDeleted }: Params) {
	const isEdit = !!item
	const createMut = useCreateGroupFormPrice()
	const updateMut = useUpdateGroupFormPrice()
	const deleteMut = useDeleteGroupFormPrice()
	const [confirmOpen, setConfirmOpen] = useState(false)

	const { data: formOptions } = useFormConfigOptions()
	const { data: groupOptions } = useGroupOptions()

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		watch,
		formState: { errors },
	} = useForm<GroupFormPriceFormValues>({
		resolver: zodResolver(schema),
		defaultValues: defaults(item),
	})

	useEffect(() => {
		if (item) reset(defaults(item))
	}, [item, reset])

	const formConfigId = watch('form_config_id')
	const groupId = watch('group_id')
	const isActive = watch('is_active')

	const onSubmit = handleSubmit(async (values) => {
		try {
			if (isEdit && item) {
				await updateMut.mutateAsync({ id: item.id, dto: values })
				toast.success('Form price updated')
			} else {
				await createMut.mutateAsync(values)
				toast.success('Form price created')
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
			toast.success('Form price deleted')
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
		formConfigId,
		groupId,
		isActive,
		formOptions: formOptions ?? [],
		groupOptions: groupOptions ?? [],
		onSubmit,
		isPending: createMut.isPending || updateMut.isPending,
		confirmOpen,
		setConfirmOpen,
		isDeleting: deleteMut.isPending,
		handleDelete,
	}
}
