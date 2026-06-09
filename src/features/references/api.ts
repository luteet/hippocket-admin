import { api } from '@/lib/api/client'
import type {
	CatalogItemDto,
	CatalogListData,
	CatalogRecord,
	RefOption,
} from '@/types/api'

// The reference-data (selects) endpoints all return a flat `[{ id, name }]`
// list with no pagination — see the "Reference data (selects)" folder in the
// Postman collection. One fetcher serves every kind; the caller passes the path.
// These power the partner-form selects (see usePartnerForm) and are read-only.
export async function listReferenceOptions(
	endpoint: string,
): Promise<RefOption[]> {
	const { data } = await api.get<RefOption[]>(endpoint)
	return data
}

// Catalogs (partner reference tables) — the editable source behind the same
// sections. Every endpoint shares the `{ items, total, offset, count }`
// envelope and string-id records, so one set of CRUD helpers serves all four
// kinds; the caller passes the catalog path (e.g. `/catalogs/partner-locations/`).
export async function listCatalog(
	endpoint: string,
	params: { offset: number; count: number; search?: string },
): Promise<CatalogListData> {
	const query: Record<string, string | number> = {
		offset: params.offset,
		count: params.count,
	}
	if (params.search) query.search = params.search

	const { data } = await api.get<CatalogListData>(endpoint, { params: query })
	return data
}

export async function createCatalogItem(
	endpoint: string,
	dto: CatalogItemDto,
): Promise<CatalogRecord> {
	const { data } = await api.post<CatalogRecord>(endpoint, dto)
	return data
}

export async function updateCatalogItem(
	endpoint: string,
	id: string,
	dto: CatalogItemDto,
): Promise<CatalogRecord> {
	const { data } = await api.put<CatalogRecord>(`${endpoint}${id}/`, dto)
	return data
}

export async function deleteCatalogItem(
	endpoint: string,
	id: string,
): Promise<void> {
	await api.delete(`${endpoint}${id}/`)
}

/**
 * Upload (replace) a category's icon. `PUT /catalogs/categories/{id}/icon/` takes
 * a `multipart/form-data` body with a single `file` field and returns the updated
 * category (new link in `icon`). Only the categories catalog has an icon. Clear
 * the JSON default Content-Type so axios sets `multipart/form-data` with the
 * boundary.
 */
export async function uploadCategoryIcon(
	id: string,
	file: File,
): Promise<CatalogRecord> {
	const form = new FormData()
	form.append('file', file)
	const { data } = await api.put<CatalogRecord>(
		`/catalogs/categories/${id}/icon/`,
		form,
		{ headers: { 'Content-Type': undefined } },
	)
	return data
}
