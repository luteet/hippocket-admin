import { useDetailPage, useDetailPageDelete } from '@/components/detail/useDetailPage'
import { useContact, useDeleteContact } from './hooks'

export function useContactDetailPage() {
	const { id, onBack, onEdit } =
		useDetailPage({ basePath: '/contacts' })
	const { data: contact, isLoading } = useContact(id)
	const deleteMut = useDeleteContact()
	const { onDelete, isDeleting } = useDetailPageDelete(
		id,
		(id) => deleteMut.mutateAsync(id),
		deleteMut.isPending,
		{ basePath: '/contacts', successMessage: 'Contact deleted' },
	)

	return {
		contact,
		isLoading,
		ready: Boolean(contact),
		onBack,
		onEdit,
		onDelete,
		isDeleting,
	}
}
