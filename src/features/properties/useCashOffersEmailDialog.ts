import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import type { CashOffersEmail } from '@/types/api'
import { useCreateCashOffersEmail, useUpdateCashOffersEmail } from './hooks'

const schema = z.object({
	email: z.email('Invalid email'),
	name: z.string().min(1, 'Enter a name'),
	is_active: z.boolean(),
})

export type CashOffersEmailFormValues = z.infer<typeof schema>

interface Params {
	groupId: number | null
	email?: CashOffersEmail | null
	onSuccess: () => void
}

export function useCashOffersEmailDialog({
	groupId,
	email,
	onSuccess,
}: Params) {
	const isEdit = !!email
	const createMut = useCreateCashOffersEmail(groupId)
	const updateMut = useUpdateCashOffersEmail(groupId)

	const form = useForm<CashOffersEmailFormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: email?.email ?? '',
			name: email?.name ?? '',
			is_active: email?.is_active ?? true,
		},
	})
	const {
		register,
		handleSubmit,
		reset,
		watch,
		setValue,
		formState: { errors },
	} = form

	// Sync the form when the target email changes (open/switch row).
	useEffect(() => {
		reset({
			email: email?.email ?? '',
			name: email?.name ?? '',
			is_active: email?.is_active ?? true,
		})
	}, [email, reset])

	const onSubmit = handleSubmit(async (values) => {
		try {
			if (isEdit && email) {
				await updateMut.mutateAsync({
					offerId: email.id,
					dto: values,
				})
				toast.success('Email updated')
			} else {
				// New subscriptions inherit the property's group (null = all).
				await createMut.mutateAsync({ ...values, group_id: groupId })
				toast.success('Email created')
			}
			onSuccess()
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to save email'))
		}
	})

	return {
		isEdit,
		register,
		errors,
		isActive: watch('is_active'),
		setIsActive: (value: boolean) => setValue('is_active', value),
		isPending: createMut.isPending || updateMut.isPending,
		onSubmit,
	}
}
