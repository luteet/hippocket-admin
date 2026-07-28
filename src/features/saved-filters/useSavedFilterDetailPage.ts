import { useDetailPage, useDetailPageDelete } from '@/components/detail/useDetailPage'
import { useSavedFilter, useDeleteSavedFilter } from './hooks'

export function useSavedFilterDetailPage() {
	const { id, onBack, onEdit } =
		useDetailPage({ basePath: '/saved-filters' })
	const { data: filter, isLoading } = useSavedFilter(id)
	const deleteMut = useDeleteSavedFilter()
	const { onDelete, isDeleting } = useDetailPageDelete(
		id,
		(id) => deleteMut.mutateAsync(id),
		deleteMut.isPending,
		{ basePath: '/saved-filters', successMessage: 'Saved filter deleted' },
	)

	return {
		filter,
		isLoading,
		ready: Boolean(filter),
		onBack,
		onEdit,
		onDelete,
		isDeleting,
	}
}
