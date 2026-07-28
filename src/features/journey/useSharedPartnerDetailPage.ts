import { useDetailPage, useDetailPageDelete } from '@/components/detail/useDetailPage'
import { useDeleteSharedPartner, useSharedPartner } from './hooks'

export function useSharedPartnerDetailPage() {
	const { id, onBack, onEdit, activeTab, onTabChange } =
		useDetailPage({ basePath: '/shared-partners', tabKeys: ['general', 'entries'] as const })
	const { data: shared, isLoading } = useSharedPartner(id)
	const deleteMut = useDeleteSharedPartner()
	const { onDelete, isDeleting } = useDetailPageDelete(
		id,
		(id) => deleteMut.mutateAsync(id),
		deleteMut.isPending,
		{ basePath: '/shared-partners', successMessage: 'Shared partner deleted' },
	)

	return {
		shared,
		sharedId: id,
		isLoading,
		ready: Boolean(shared),
		onBack,
		onEdit,
		activeTab,
		onTabChange,
		onDelete,
		isDeleting,
	}
}
