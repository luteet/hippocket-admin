import { api } from '@/lib/api/client'
import type {
	Payment,
	PaymentData,
	PaymentsMeta,
	SortParams,
} from '@/types/api'

export interface PaymentFilters extends SortParams {
	offset: number
	count: number
	payment_type?: string
	form_name?: string
	search?: string
	created_from?: string
	created_to?: string
}

export async function listPayments(
	filters: PaymentFilters,
): Promise<PaymentData> {
	const params: Record<string, string | number> = {
		offset: filters.offset,
		count: filters.count,
	}
	if (filters.payment_type) params.payment_type = filters.payment_type
	if (filters.form_name) params.form_name = filters.form_name
	if (filters.search) params.search = filters.search
	if (filters.created_from) params.created_from = filters.created_from
	if (filters.created_to) params.created_to = filters.created_to
	if (filters.sort_by) params.sort_by = filters.sort_by
	if (filters.order) params.order = filters.order

	const { data } = await api.get<PaymentData>('/payments/', { params })
	return data
}

export async function getPaymentsMeta(): Promise<PaymentsMeta> {
	const { data } = await api.get<PaymentsMeta>('/payments/meta/')
	return data
}

export async function getPayment(id: string): Promise<Payment> {
	const { data } = await api.get<Payment>(`/payments/${id}/`)
	return data
}
