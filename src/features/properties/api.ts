import { api } from '@/lib/api/client'
import type {
	CreatePropertyDto,
	PaginationParams,
	Property,
	PropertiesData,
	UpdatePropertyDto,
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

/**
 * Upload (replace) a property's main photo. `PUT /properties/{id}/image/` takes a
 * `multipart/form-data` body with a single `file` field and returns the updated
 * property (new link in `image`). Clear the JSON default Content-Type so axios
 * detects the FormData and sets `multipart/form-data` with the boundary.
 */
export async function uploadPropertyImage(
	id: string,
	file: File,
): Promise<Property> {
	const form = new FormData()
	form.append('file', file)
	const { data } = await api.put<Property>(`/properties/${id}/image/`, form, {
		headers: { 'Content-Type': undefined },
	})
	return data
}
