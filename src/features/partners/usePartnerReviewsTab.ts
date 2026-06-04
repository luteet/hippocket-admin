import { useState } from 'react'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import type { PartnerReview } from '@/types/api'
import { usePartnerReviews, useDeletePartnerReview } from './hooks'

export function usePartnerReviewsTab(partnerId: string) {
	const { data: reviews, isLoading } = usePartnerReviews(partnerId)
	const deleteMut = useDeletePartnerReview(partnerId)

	const [dialogOpen, setDialogOpen] = useState(false)
	const [editing, setEditing] = useState<PartnerReview | null>(null)
	const [pendingDelete, setPendingDelete] = useState<PartnerReview | null>(
		null,
	)

	const openCreate = () => {
		setEditing(null)
		setDialogOpen(true)
	}

	const openEdit = (review: PartnerReview) => {
		setEditing(review)
		setDialogOpen(true)
	}

	const handleDelete = async () => {
		if (!pendingDelete) return
		try {
			await deleteMut.mutateAsync(pendingDelete.id)
			toast.success('Review deleted')
			setPendingDelete(null)
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to delete review'))
		}
	}

	return {
		reviews,
		isLoading,
		dialogOpen,
		setDialogOpen,
		editing,
		openCreate,
		openEdit,
		pendingDelete,
		setPendingDelete,
		isDeleting: deleteMut.isPending,
		handleDelete,
	}
}
