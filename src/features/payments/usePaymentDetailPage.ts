import { useNavigate, useParams } from 'react-router'

import { usePayment } from './hooks'

export function usePaymentDetailPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: payment, isLoading } = usePayment(id)

	return {
		payment,
		isLoading,
		goBack: () => navigate('/payments'),
	}
}
