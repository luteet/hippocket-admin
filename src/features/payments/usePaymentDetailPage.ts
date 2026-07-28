import { useDetailPage } from '@/components/detail/useDetailPage'
import { usePayment } from './hooks'

export function usePaymentDetailPage() {
	const { id, onBack } =
		useDetailPage({ basePath: '/payments' })
	const { data: payment, isLoading } = usePayment(id)

	return {
		payment,
		isLoading,
		ready: Boolean(payment),
		onBack,
	}
}
