import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'

import { api, getApiErrorMessage } from '@/lib/api/client'
import type { GroupOption } from '@/types/api'
import { usePartner, useDeletePartner } from './hooks'

export type PartnerDetailTab = 'details' | 'reviews'

export function usePartnerDetailPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: partner, isLoading } = usePartner(id)
	const deleteMut = useDeletePartner()
	const [tab, setTab] = useState<PartnerDetailTab>('details')

	const { data: groupOptions } = useQuery<GroupOption[]>({
		queryKey: ['refs', 'groups'],
		queryFn: () =>
			api.get<GroupOption[]>('/refs/groups/').then((r) => r.data),
		staleTime: 5 * 60_000,
	})

	const handleDelete = async () => {
		if (!id) return
		try {
			await deleteMut.mutateAsync(id)
			toast.success('Partner deleted')
			navigate('/partners')
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to delete'))
		}
	}

	const groupNames = new Map(
		(groupOptions ?? []).map((g) => [g.id, g.name]),
	)

	return {
		partner,
		partnerId: id,
		isLoading,
		tab,
		setTab,
		isDeleting: deleteMut.isPending,
		handleDelete,
		goBack: () => navigate('/partners'),
		goToEdit: () => navigate(`/partners/${id}/edit`),
		partnerGroupNames: groupNames,
	}
}
