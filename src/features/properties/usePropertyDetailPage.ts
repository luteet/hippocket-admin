import { useNavigate } from 'react-router'

import { useDetailPage, useDetailPageDelete } from '@/components/detail/useDetailPage'
import { useProperty, useDeleteProperty } from './hooks'

export function usePropertyDetailPage() {
	const { id, onBack, onEdit, activeTab, onTabChange } =
		useDetailPage({ basePath: '/properties', tabKeys: ['details', 'images'] as const })
	const { data: property, isLoading } = useProperty(id)
	const deleteMut = useDeleteProperty()
	const { onDelete, isDeleting } = useDetailPageDelete(
		id,
		(id) => deleteMut.mutateAsync(id),
		deleteMut.isPending,
		{ basePath: '/properties', successMessage: 'Property deleted' },
	)
	const navigate = useNavigate()

	return {
		property,
		isLoading,
		ready: Boolean(property),
		onBack,
		onEdit,
		activeTab,
		onTabChange,
		onDelete,
		isDeleting,
		openImage: (imageId: string) => navigate(`/property-images/${imageId}`),
	}
}
