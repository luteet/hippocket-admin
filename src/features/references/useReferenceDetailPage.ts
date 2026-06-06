import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import { useCatalogItem, useDeleteCatalogItem } from './hooks'
import { REFERENCE_CONFIG, type ReferenceKind } from './useReferenceListPage'

export function useReferenceDetailPage(kind: ReferenceKind) {
	const { id } = useParams()
	const navigate = useNavigate()
	const config = REFERENCE_CONFIG[kind]
	const { data: item, isLoading } = useCatalogItem(
		config.queryKey,
		config.endpoint,
		id,
	)
	const deleteMut = useDeleteCatalogItem(
		config.queryKey,
		config.queryKey,
		config.endpoint,
	)
	const [confirmOpen, setConfirmOpen] = useState(false)

	const handleDelete = async () => {
		if (!id) return
		try {
			await deleteMut.mutateAsync(id)
			toast.success(`${config.singular} deleted`)
			navigate(`/${kind}`)
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to delete'))
		}
	}

	return {
		config,
		item,
		isLoading,
		confirmOpen,
		setConfirmOpen,
		isDeleting: deleteMut.isPending,
		handleDelete,
		goBack: () => navigate(`/${kind}`),
		goToEdit: () => navigate(`/${kind}/${id}/edit`),
	}
}
