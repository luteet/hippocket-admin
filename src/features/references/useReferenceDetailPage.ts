import { useCatalogItem, useDeleteCatalogItem } from './hooks'
import { REFERENCE_CONFIG, type ReferenceKind } from './useReferenceListPage'
import { useDetailPage, useDetailPageDelete } from '@/components/detail/useDetailPage'

export function useReferenceDetailPage(kind: ReferenceKind) {
	const { id, onBack, onEdit } =
		useDetailPage({ basePath: `/${kind}` })
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
	const { onDelete, isDeleting } = useDetailPageDelete(
		id,
		(id) => deleteMut.mutateAsync(id),
		deleteMut.isPending,
		{ basePath: `/${kind}`, successMessage: `${config.singular} deleted` },
	)

	return {
		config,
		item,
		isLoading,
		ready: Boolean(item),
		onBack,
		onEdit,
		onDelete,
		isDeleting,
	}
}
