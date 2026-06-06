// Catalogs (partner reference tables) — the editable backing for the
// Categories / Segments / Locations / Services sections. Unlike the read-only
// `/refs/*` (selects) lists (which return a flat `[{ id, name }]`), the
// `/admin-api/catalogs/*` endpoints expose full CRUD with paginated
// `{ items, total, offset, count }` envelopes and string (UUID) ids.
//
// The three partner-* catalogs carry only `name` + `sort`; `categories`
// additionally carries `description` + `keywords` (optional here so one record
// type serves every kind).
export interface CatalogRecord {
	id: string
	name: string
	sort: number
	description?: string
	keywords?: string
	created_at?: string
}

export interface CatalogListData {
	items: CatalogRecord[]
	total: number
	offset: number
	count: number
}

// Create/update share the same shape. `description`/`keywords` are sent only
// for the categories catalog (see `hasContent` in REFERENCE_CONFIG).
export interface CatalogItemDto {
	name: string
	sort: number
	description?: string
	keywords?: string
}
