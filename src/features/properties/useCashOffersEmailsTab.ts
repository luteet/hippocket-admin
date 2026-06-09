import { useState } from 'react'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import type { CashOffersEmail } from '@/types/api'
import { useCashOffersEmails, useDeleteCashOffersEmail } from './hooks'

export function useCashOffersEmailsTab(groupId: number | null) {
	const { data: emails, isLoading } = useCashOffersEmails(groupId)
	const deleteMut = useDeleteCashOffersEmail(groupId)

	const [dialogOpen, setDialogOpen] = useState(false)
	const [editing, setEditing] = useState<CashOffersEmail | null>(null)
	const [pendingDelete, setPendingDelete] = useState<CashOffersEmail | null>(
		null,
	)

	const openCreate = () => {
		setEditing(null)
		setDialogOpen(true)
	}

	const openEdit = (email: CashOffersEmail) => {
		setEditing(email)
		setDialogOpen(true)
	}

	const handleDelete = async () => {
		if (!pendingDelete) return
		try {
			await deleteMut.mutateAsync(pendingDelete.id)
			toast.success('Email deleted')
			setPendingDelete(null)
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to delete email'))
		}
	}

	return {
		emails,
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
