import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import { useDeleteSharedPartner, useSharedPartner } from './hooks'

export type SharedPartnerDetailTab = 'general' | 'entries'

export function useSharedPartnerDetailPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: shared, isLoading } = useSharedPartner(id)
	const deleteMut = useDeleteSharedPartner()
	const [tab, setTab] = useState<SharedPartnerDetailTab>('general')

	const handleDelete = async () => {
		if (!id) return
		try {
			await deleteMut.mutateAsync(id)
			toast.success('Shared partner deleted')
			navigate('/shared-partners')
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to delete'))
		}
	}

	return {
		shared,
		sharedId: id,
		isLoading,
		tab,
		setTab,
		isDeleting: deleteMut.isPending,
		handleDelete,
		goBack: () => navigate('/shared-partners'),
		goToEdit: () => navigate(`/shared-partners/${id}/edit`),
	}
}
