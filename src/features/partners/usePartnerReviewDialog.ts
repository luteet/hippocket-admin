import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import type { PartnerReview } from '@/types/api'
import { useCreatePartnerReview, useUpdatePartnerReview } from './hooks'

const schema = z.object({
	name: z.string().min(1, 'Enter a name'),
	text: z.string().min(1, 'Enter the review text'),
})

export type PartnerReviewFormValues = z.infer<typeof schema>

interface Params {
	partnerId: string
	review?: PartnerReview | null
	onSuccess: () => void
}

export function usePartnerReviewDialog({
	partnerId,
	review,
	onSuccess,
}: Params) {
	const isEdit = !!review
	const createMut = useCreatePartnerReview(partnerId)
	const updateMut = useUpdatePartnerReview(partnerId)

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<PartnerReviewFormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: review?.name ?? '',
			text: review?.text ?? '',
		},
	})

	// Sync the form when the target review changes (open/switch row).
	useEffect(() => {
		reset({ name: review?.name ?? '', text: review?.text ?? '' })
	}, [review, reset])

	const onSubmit = handleSubmit(async (values) => {
		try {
			if (isEdit && review) {
				await updateMut.mutateAsync({
					reviewId: review.id,
					dto: values,
				})
				toast.success('Review updated')
			} else {
				await createMut.mutateAsync(values)
				toast.success('Review created')
			}
			onSuccess()
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to save review'))
		}
	})

	return {
		isEdit,
		register,
		errors,
		isPending: createMut.isPending || updateMut.isPending,
		onSubmit,
	}
}
