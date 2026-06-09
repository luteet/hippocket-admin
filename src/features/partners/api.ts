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
			...(params.sort_by ? { sort_by: params.sort_by } : {}),
			...(params.order ? { order: params.order } : {}),
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

/**
 * Upload (replace) a partner's logo. `PUT /partners/{id}/logo/` takes a
 * `multipart/form-data` body with a single `file` field and returns the updated
 * partner (new link in `logo_url`). Clear the JSON default Content-Type so axios
 * detects the FormData and sets `multipart/form-data` with the boundary.
 */
export async function uploadPartnerLogo(
	id: string,
	file: File,
): Promise<Partner> {
	const form = new FormData()
	form.append('file', file)
	const { data } = await api.put<Partner>(`/partners/${id}/logo/`, form, {
		headers: { 'Content-Type': undefined },
	})
	return data
}

/**
 * Upload (replace) a partner's video preview cover. `PUT /partners/{id}/preview/`
 * mirrors {@link uploadPartnerLogo}; the new link is returned in `preview_url`.
 */
export async function uploadPartnerPreview(
	id: string,
	file: File,
): Promise<Partner> {
	const form = new FormData()
	form.append('file', file)
	const { data } = await api.put<Partner>(`/partners/${id}/preview/`, form, {
		headers: { 'Content-Type': undefined },
	})
	return data
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

/**
 * Upload (replace) a review's avatar. `PUT /partners/{id}/reviews/{reviewId}/avatar/`
 * takes a `multipart/form-data` body with a single `file` field and returns the
 * updated review (new link in `avatar_url`). Clear the JSON default Content-Type
 * so axios sets `multipart/form-data` with the boundary.
 */
export async function uploadPartnerReviewAvatar(
	partnerId: string,
	reviewId: string,
	file: File,
): Promise<PartnerReview> {
	const form = new FormData()
	form.append('file', file)
	const { data } = await api.put<PartnerReview>(
		`/partners/${partnerId}/reviews/${reviewId}/avatar/`,
		form,
		{ headers: { 'Content-Type': undefined } },
	)
	return data
}
