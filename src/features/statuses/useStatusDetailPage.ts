import { useDetailPage, useDetailPageDelete } from '@/components/detail/useDetailPage'
import { useStatus, useDeleteStatus } from './hooks'

export function useStatusDetailPage() {
	const { id, onBack, onEdit } =
		useDetailPage({ basePath: '/statuses' })
	const numericId = id ? Number(id) : undefined
	const { data: status, isLoading } = useStatus(numericId)
	const deleteMut = useDeleteStatus()
	const { onDelete, isDeleting } = useDetailPageDelete(
		numericId !== undefined ? id : undefined,
		(_id) => deleteMut.mutateAsync(numericId!),
		deleteMut.isPending,
		{ basePath: '/statuses', successMessage: 'Status deleted' },
	)

	return {
		status,
		isLoading,
		ready: Boolean(status),
		onBack,
		onEdit,
		onDelete,
		isDeleting,
	}
}
