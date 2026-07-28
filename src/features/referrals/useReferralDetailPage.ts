import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import { useDetailPage, useDetailPageDelete } from '@/components/detail/useDetailPage'
import {
	useDeleteReferral,
	useMarkReferralPaid,
	useReferral,
	useStatuses,
	useUpdateReferralStatus,
} from './hooks'

export function useReferralDetailPage() {
	const { id, onBack, onEdit } =
		useDetailPage({ basePath: '/referrals' })
	const { data: referral, isLoading } = useReferral(id)
	const { data: statuses } = useStatuses()
	const statusMut = useUpdateReferralStatus()
	const paidMut = useMarkReferralPaid()
	const deleteMut = useDeleteReferral()
	const { onDelete, isDeleting } = useDetailPageDelete(
		id,
		(id) => deleteMut.mutateAsync(id),
		deleteMut.isPending,
		{ basePath: '/referrals', successMessage: 'Referral deleted' },
	)

	const currentStatus = referral?.status ?? ''

	const handleStatusChange = async (newStatus: string) => {
		if (!id || newStatus === currentStatus) return
		try {
			await statusMut.mutateAsync({ id, newStatus })
			toast.success('Status updated')
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to update status'))
		}
	}

	const handleMarkPaid = async () => {
		if (!id) return
		try {
			await paidMut.mutateAsync(id)
			toast.success('Marked as paid')
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to mark as paid'))
		}
	}

	return {
		referral,
		isLoading,
		ready: Boolean(referral),
		statuses,
		currentStatus,
		handleStatusChange,
		handleMarkPaid,
		isUpdatingStatus: statusMut.isPending,
		isMarkingPaid: paidMut.isPending,
		onBack,
		onEdit,
		onDelete,
		isDeleting,
	}
}
