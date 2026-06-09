import { api } from '@/lib/api/client'
import type {
	CashOffersEmail,
	CashOffersEmailsData,
	CreateCashOffersEmailDto,
	CreatePropertyDto,
	PaginationParams,
	Property,
	PropertiesData,
	PropertyImage,
	PropertyImagesData,
	UpdateCashOffersEmailDto,
	UpdatePropertyDto,
	UpdatePropertyImageDto,
} from '@/types/api'

export async function listProperties(
	params: PaginationParams,
): Promise<PropertiesData> {
	const { data } = await api.get<PropertiesData>('/properties/', {
		params: {
			offset: params.offset,
			count: params.count,
			...(params.search ? { search: params.search } : {}),
		},
	})
	return data
}

export async function getProperty(id: string): Promise<Property> {
	const { data } = await api.get<Property>(`/properties/${id}/`)
	return data
}

export async function createProperty(
	dto: CreatePropertyDto,
): Promise<Property> {
	const { data } = await api.post<Property>('/properties/', dto)
	return data
}

export async function updateProperty(
	id: string,
	dto: UpdatePropertyDto,
): Promise<Property> {
	const { data } = await api.put<Property>(`/properties/${id}/`, dto)
	return data
}

export async function deleteProperty(id: string): Promise<void> {
	await api.delete(`/properties/${id}/`)
}

// --- Property images (child) ---------------------------------------------
// Uploads happen in the app; the admin only lists, reorders (`sort`) and
// deletes. Images for one property are fetched with `?property_id=`.

export async function listPropertyImages(
	propertyId: string,
): Promise<PropertyImage[]> {
	const { data } = await api.get<PropertyImagesData>('/property-images/', {
		params: { property_id: propertyId, offset: 0, count: 500 },
	})
	return data.items
}

export async function updatePropertyImage(
	imageId: string,
	dto: UpdatePropertyImageDto,
): Promise<PropertyImage> {
	const { data } = await api.put<PropertyImage>(
		`/property-images/${imageId}/`,
		dto,
	)
	return data
}

export async function deletePropertyImage(imageId: string): Promise<void> {
	await api.delete(`/property-images/${imageId}/`)
}

// --- Cash offers emails (child, group-scoped) ----------------------------
// Linked to properties through `group_id` (null = all properties), so a
// property's subscriptions are those sharing its group.

export async function listCashOffersEmails(
	groupId: number | null,
): Promise<CashOffersEmail[]> {
	const { data } = await api.get<CashOffersEmailsData>(
		'/cash-offers-emails/',
		{
			params: {
				offset: 0,
				count: 500,
				...(groupId != null ? { group_id: groupId } : {}),
			},
		},
	)
	return data.items
}

export async function createCashOffersEmail(
	dto: CreateCashOffersEmailDto,
): Promise<CashOffersEmail> {
	const { data } = await api.post<CashOffersEmail>(
		'/cash-offers-emails/',
		dto,
	)
	return data
}

export async function updateCashOffersEmail(
	offerId: string,
	dto: UpdateCashOffersEmailDto,
): Promise<CashOffersEmail> {
	const { data } = await api.put<CashOffersEmail>(
		`/cash-offers-emails/${offerId}/`,
		dto,
	)
	return data
}

export async function deleteCashOffersEmail(offerId: string): Promise<void> {
	await api.delete(`/cash-offers-emails/${offerId}/`)
}
