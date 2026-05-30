import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import {
	useReferral,
	useStatuses,
	useUpdateReferralStatus,
	useMarkReferralPaid,
} from './hooks'

export function useReferralDetailDialog(referralId: string | null) {
	const { data, isLoading } = useReferral(referralId ?? undefined)
	const { data: statuses } = useStatuses()
	const statusMut = useUpdateReferralStatus()
	const paidMut = useMarkReferralPaid()

	const currentStatus = data?.status ?? ''

	const handleStatusChange = async (newStatus: string) => {
		if (!referralId || newStatus === currentStatus) return
		try {
			await statusMut.mutateAsync({ id: referralId, newStatus })
			toast.success('Status updated')
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to update status'))
		}
	}

	const handleMarkPaid = async () => {
		if (!referralId) return
		try {
			await paidMut.mutateAsync(referralId)
			toast.success('Marked as paid')
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to mark as paid'))
		}
	}

	return {
		data,
		isLoading,
		statuses,
		currentStatus,
		handleStatusChange,
		handleMarkPaid,
		isUpdatingStatus: statusMut.isPending,
		isMarkingPaid: paidMut.isPending,
	}
}
