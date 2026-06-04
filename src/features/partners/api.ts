import { api } from '@/lib/api/client'
import type {
	CreatePartnerDto,
	CreatePartnerReviewDto,
	PaginationParams,
	Partner,
	PartnerReview,
	PartnersData,
	UpdatePartnerDto,
	UpdatePartnerReviewDto,
} from '@/types/api'

export async function listPartners(
	params: PaginationParams,
): Promise<PartnersData> {
	const { data } = await api.get<PartnersData>('/partners/', {
		params: {
			offset: params.offset,
			count: params.count,
			...(params.search ? { search: params.search } : {}),
		},
	})
	return data
}

export async function getPartner(id: string): Promise<Partner> {
	const { data } = await api.get<Partner>(`/partners/${id}/`)
	return data
}

export async function createPartner(dto: CreatePartnerDto): Promise<Partner> {
	const { data } = await api.post<Partner>('/partners/', dto)
	return data
}

export async function updatePartner(
	id: string,
	dto: UpdatePartnerDto,
): Promise<Partner> {
	const { data } = await api.put<Partner>(`/partners/${id}/`, dto)
	return data
}

export async function deletePartner(id: string): Promise<void> {
	await api.delete(`/partners/${id}/`)
}

export async function listPartnerReviews(
	partnerId: string,
): Promise<PartnerReview[]> {
	const { data } = await api.get<PartnerReview[]>(
		`/partners/${partnerId}/reviews/`,
	)
	return data
}

export async function createPartnerReview(
	partnerId: string,
	dto: CreatePartnerReviewDto,
): Promise<PartnerReview> {
	const { data } = await api.post<PartnerReview>(
		`/partners/${partnerId}/reviews/`,
		dto,
	)
	return data
}

export async function updatePartnerReview(
	partnerId: string,
	reviewId: string,
	dto: UpdatePartnerReviewDto,
): Promise<PartnerReview> {
	const { data } = await api.put<PartnerReview>(
		`/partners/${partnerId}/reviews/${reviewId}/`,
		dto,
	)
	return data
}

export async function deletePartnerReview(
	partnerId: string,
	reviewId: string,
): Promise<void> {
	await api.delete(`/partners/${partnerId}/reviews/${reviewId}/`)
}
