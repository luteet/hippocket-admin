import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import type { LinkName } from '@/types/api'
import {
	useCreateLinkName,
	useDeleteLinkName,
	useUpdateLinkName,
} from '../hooks'

const schema = z.object({
	name: z.string().min(1, 'Required'),
	link: z.url('Invalid URL'),
})

export type LinkNameFormValues = z.infer<typeof schema>

interface Params {
	item?: LinkName | null
	onSuccess: () => void
	onDeleted: () => void
}

export function useLinkNameForm({ item, onSuccess, onDeleted }: Params) {
	const isEdit = !!item
	const createMut = useCreateLinkName()
	const updateMut = useUpdateLinkName()
	const deleteMut = useDeleteLinkName()

	const form = useForm<LinkNameFormValues>({
		resolver: zodResolver(schema),
		defaultValues: { name: item?.name ?? '', link: item?.link ?? '' },
	})
	const { handleSubmit, reset } = form

	useEffect(() => {
		if (item) reset({ name: item.name, link: item.link })
	}, [item, reset])

	const onSubmit = handleSubmit(async (values) => {
		try {
			if (isEdit && item) {
				await updateMut.mutateAsync({ id: item.id, dto: values })
				toast.success('Link updated')
			} else {
				await createMut.mutateAsync(values)
				toast.success('Link created')
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
			toast.success('Link deleted')
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
