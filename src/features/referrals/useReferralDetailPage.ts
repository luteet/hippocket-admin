import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import {
	useDeleteReferral,
	useMarkReferralPaid,
	useReferral,
	useStatuses,
	useUpdateReferralStatus,
} from './hooks'

export function useReferralDetailPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: referral, isLoading } = useReferral(id)
	const { data: statuses } = useStatuses()
	const statusMut = useUpdateReferralStatus()
	const paidMut = useMarkReferralPaid()
	const deleteMut = useDeleteReferral()

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

	const handleDelete = async () => {
		if (!id) return
		try {
			await deleteMut.mutateAsync(id)
			toast.success('Referral deleted')
			navigate('/referrals')
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to delete'))
		}
	}

	return {
		referral,
		isLoading,
		statuses,
		currentStatus,
		handleStatusChange,
		handleMarkPaid,
		isUpdatingStatus: statusMut.isPending,
		isMarkingPaid: paidMut.isPending,
		isDeleting: deleteMut.isPending,
		handleDelete,
		goBack: () => navigate('/referrals'),
		goToEdit: () => navigate(`/referrals/${id}/edit`),
	}
}
