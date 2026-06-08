import { useQuery } from '@tanstack/react-query'

import {
	getPayment,
	getPaymentsMeta,
	listPayments,
	type PaymentFilters,
} from './api'

const KEY = 'payments'

export function usePayments(filters: PaymentFilters) {
	return useQuery({
		queryKey: [KEY, filters],
		queryFn: () => listPayments(filters),
	})
}

export function usePaymentsMeta() {
	return useQuery({
		queryKey: [KEY, 'meta'],
		queryFn: getPaymentsMeta,
		staleTime: 5 * 60_000,
	})
}

export function usePayment(id: string | undefined) {
	return useQuery({
		queryKey: [KEY, 'detail', id],
		queryFn: () => getPayment(id as string),
		enabled: !!id,
	})
}
