import { useState } from 'react'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import type { SharedPartnerEntry } from '@/types/api'
import { useDeleteSharedPartnerEntry } from './hooks'

/** Keep a row's action buttons from also triggering the row's edit click. */
export const stopRowClick = (e: { stopPropagation: () => void }) =>
	e.stopPropagation()

export function useSharedPartnerEntriesTab(sharedId: string) {
	const deleteMut = useDeleteSharedPartnerEntry(sharedId)

	const [dialogOpen, setDialogOpen] = useState(false)
	const [editing, setEditing] = useState<SharedPartnerEntry | null>(null)
	const [pendingDelete, setPendingDelete] =
		useState<SharedPartnerEntry | null>(null)

	const openCreate = () => {
		setEditing(null)
		setDialogOpen(true)
	}

	const openEdit = (entry: SharedPartnerEntry) => {
		setEditing(entry)
		setDialogOpen(true)
	}

	const handleDelete = async () => {
		if (!pendingDelete) return
		try {
			await deleteMut.mutateAsync(pendingDelete.id)
			toast.success('Entry removed')
			setPendingDelete(null)
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to remove entry'))
		}
	}

	return {
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
