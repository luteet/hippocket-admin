import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import type { TokenCourse } from '@/types/api'
import {
	useCreateTokenCourse,
	useDeleteTokenCourse,
	useUpdateTokenCourse,
} from '../hooks'

const schema = z.object({
	coin_to_money: z
		.number({ message: 'Enter a number' })
		.gt(0, 'Must be greater than 0'),
})

export type TokenCourseFormValues = z.infer<typeof schema>

interface Params {
	item?: TokenCourse | null
	onSuccess: () => void
	onDeleted: () => void
}

export function useTokenCourseForm({ item, onSuccess, onDeleted }: Params) {
	const isEdit = !!item
	const createMut = useCreateTokenCourse()
	const updateMut = useUpdateTokenCourse()
	const deleteMut = useDeleteTokenCourse()

	const form = useForm<TokenCourseFormValues>({
		resolver: zodResolver(schema),
		defaultValues: { coin_to_money: item?.coin_to_money ?? 0 },
	})
	const { handleSubmit, reset } = form

	useEffect(() => {
		if (item) reset({ coin_to_money: item.coin_to_money })
	}, [item, reset])

	const onSubmit = handleSubmit(async (values) => {
		try {
			if (isEdit && item) {
				await updateMut.mutateAsync({ id: item.id, dto: values })
				toast.success('Token course updated')
			} else {
				await createMut.mutateAsync(values)
				toast.success('Token course created')
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
			toast.success('Token course deleted')
			onDeleted()
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to delete'))
		}
	}

	return {
		isEdit,
		form,
		onSubmit,
		isPending: createMut.isPending || updateMut.isPending,
		isDeleting: deleteMut.isPending,
		handleDelete,
	}
}
