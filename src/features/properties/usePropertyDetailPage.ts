import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import { useProperty, useDeleteProperty } from './hooks'

export type PropertyDetailTab = 'details' | 'images' | 'emails'

export function usePropertyDetailPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: property, isLoading } = useProperty(id)
	const deleteMut = useDeleteProperty()
	const [tab, setTab] = useState<PropertyDetailTab>('details')

	const handleDelete = async () => {
		if (!id) return
		try {
			await deleteMut.mutateAsync(id)
			toast.success('Property deleted')
			navigate('/properties')
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to delete'))
		}
	}

	return {
		property,
		propertyId: id,
		isLoading,
		tab,
		setTab,
		isDeleting: deleteMut.isPending,
		handleDelete,
		goBack: () => navigate('/properties'),
		goToEdit: () => navigate(`/properties/${id}/edit`),
	}
}
