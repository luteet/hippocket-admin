import { api } from '@/lib/api/client'
import type {
	PropertiesData,
	PropertyImage,
	PropertyImagesData,
	UpdatePropertyImageDto,
} from '@/types/api'

export interface PropertyImageFilters {
	offset: number
	count: number
	property_id?: string
}

export async function listPropertyImages(
	filters: PropertyImageFilters,
): Promise<PropertyImagesData> {
	const params: Record<string, string | number> = {
		offset: filters.offset,
		count: filters.count,
	}
	if (filters.property_id) params.property_id = filters.property_id

	const { data } = await api.get<PropertyImagesData>('/property-images/', {
		params,
	})
	return data
}

export async function getPropertyImage(id: string): Promise<PropertyImage> {
	const { data } = await api.get<PropertyImage>(`/property-images/${id}/`)
	return data
}

export async function updatePropertyImage(
	id: string,
	dto: UpdatePropertyImageDto,
): Promise<PropertyImage> {
	const { data } = await api.put<PropertyImage>(
		`/property-images/${id}/`,
		dto,
	)
	return data
}

export async function deletePropertyImage(id: string): Promise<void> {
	await api.delete(`/property-images/${id}/`)
}

/** Page size for the property picker's infinite scroll. */
export const PROPERTIES_PAGE_SIZE = 30

export interface PropertySearchOption {
	id: string
	address: string
}

export interface PropertySearchPage {
	items: PropertySearchOption[]
	offset: number
	total: number
}

/**
 * Search properties for the relink picker, one page at a time. Uses the
 * paginated `/properties/` endpoint (supports `search` + `offset`/`count`) and
 * maps rows down to the lightweight `{ id, address }` option shape.
 */
export async function searchProperties(
	search: string,
	offset: number,
): Promise<PropertySearchPage> {
	const trimmed = search.trim()
	const { data } = await api.get<PropertiesData>('/properties/', {
		params: {
			offset,
			count: PROPERTIES_PAGE_SIZE,
			...(trimmed ? { search: trimmed } : {}),
		},
	})
	return {
		items: data.items.map((p) => ({
			id: p.id,
			address: [p.address, p.city].filter(Boolean).join(', '),
		})),
		offset,
		total: data.total,
	}
}
