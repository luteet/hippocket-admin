import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api/client'
import type { GroupOption } from '@/types/api'
import { useDetailPage, useDetailPageDelete } from '@/components/detail/useDetailPage'
import { usePartner, useDeletePartner } from './hooks'

export function usePartnerDetailPage() {
	const { id, onBack, onEdit, activeTab, onTabChange } =
		useDetailPage({ basePath: '/partners', tabKeys: ['details', 'reviews'] as const })
	const { data: partner, isLoading } = usePartner(id)
	const deleteMut = useDeletePartner()
	const { onDelete, isDeleting } = useDetailPageDelete(
		id,
		(id) => deleteMut.mutateAsync(id),
		deleteMut.isPending,
		{ basePath: '/partners', successMessage: 'Partner deleted' },
	)

	const { data: groupOptions } = useQuery<GroupOption[]>({
		queryKey: ['refs', 'groups'],
		queryFn: () =>
			api.get<GroupOption[]>('/refs/groups/').then((r) => r.data),
		staleTime: 5 * 60_000,
	})

	const partnerGroupNames = new Map(
		(groupOptions ?? []).map((g) => [g.id, g.name]),
	)

	return {
		partner,
		partnerId: id,
		isLoading,
		ready: Boolean(partner),
		onBack,
		onEdit,
		activeTab,
		onTabChange,
		onDelete,
		isDeleting,
		partnerGroupNames,
	}
}
