import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { useUndoableDelete } from '@/hooks/useUndoableDelete'
import type { PartnerReview } from '@/types/api'
import { usePartnerReviews, useDeletePartnerReview, reviewsKey } from './hooks'

export function usePartnerReviewsTab(partnerId: string) {
	const qc = useQueryClient()
	const { data: reviews, isLoading } = usePartnerReviews(partnerId)
	const deleteMut = useDeletePartnerReview(partnerId)

	const [dialogOpen, setDialogOpen] = useState(false)
	const [editing, setEditing] = useState<PartnerReview | null>(null)

	const openCreate = () => {
		setEditing(null)
		setDialogOpen(true)
	}

	const openEdit = (review: PartnerReview) => {
		setEditing(review)
		setDialogOpen(true)
	}

	const { remove: deleteReview } = useUndoableDelete<PartnerReview>({
		delete: (review) => deleteMut.mutateAsync(review.id),
		hide: (review) => {
			const key = reviewsKey(partnerId)
			const prev = qc.getQueryData<PartnerReview[]>(key)
			qc.setQueryData<PartnerReview[]>(key, (cur) =>
				(cur ?? []).filter((r) => r.id !== review.id),
			)
			return () => qc.setQueryData(key, prev)
		},
		label: (review) => `Deleted review by ${review.name}`,
	})

	return {
		reviews,
		isLoading,
		dialogOpen,
		setDialogOpen,
		editing,
		openCreate,
		openEdit,
		deleteReview,
	}
}
