// Property Invest section. The list endpoint wraps rows in the standard
// `{ items, total, offset, count }` envelope; `GET /properties/{id}/` returns a
// single Property with its `images` inline. The API returns many extra
// valuation/offer fields (mostly null on the dev data — `arv`, `zillow_value`,
// `our_offer`, …); the ones the admin UI surfaces are typed below.

export interface PropertiesData {
	count: number
	items: Property[]
	offset: number
	total: number
}

export interface Property {
	id: string
	/** Owning agent (the user who created the property). */
	user_id: string
	user_email: string
	/** Group the property belongs to; cash-offer emails are scoped by it. */
	group_id: number | null
	group_name: string | null
	/** Who the property is available to, e.g. `["agent", "buyer"]`. */
	available: string[]
	acquisition_agent: string
	contact_person: string
	lead_source: string
	property_type: string
	/** Display string with currency formatting, e.g. `"$567,000"`. */
	asking_price: string | null
	/** Primary image (relative media path). */
	image: string | null
	address: string
	/** `"lat/lng"` string geocoded from the address on save. */
	coordinates: string | null
	city: string
	state: string
	zip_code: string
	beds: number | null
	baths: number | null
	garage: number | null
	sqft: number | null
	year_built: number | null
	occupied_status: string | null
	majors_needed: string | null
	/** Our cash offer (integer dollars). */
	our_offer: number | null
	status: string | null
	seller_notes: string | null
	description: string | null
	/** Inline gallery, ordered by `sort`. */
	images: PropertyImage[]
	created_at: string
}

export interface CreatePropertyDto {
	address: string
	city: string
	state: string
	zip_code: string
	property_type: string
	acquisition_agent: string
	contact_person: string
	lead_source: string
	beds?: number | null
	baths?: number | null
	garage?: number | null
	sqft?: number | null
	year_built?: number | null
	asking_price?: string
	available?: string[]
	occupied_status?: string
	majors_needed?: string
	description?: string
	status?: string
	our_offer?: number | null
}

/** Partial update — every field is optional (PUT /properties/{id}/). */
export interface UpdatePropertyDto {
	address?: string
	city?: string
	state?: string
	zip_code?: string
	property_type?: string
	acquisition_agent?: string
	contact_person?: string
	lead_source?: string
	beds?: number | null
	baths?: number | null
	garage?: number | null
	sqft?: number | null
	year_built?: number | null
	asking_price?: string
	available?: string[]
	occupied_status?: string
	majors_needed?: string
	description?: string
	status?: string
	our_offer?: number | null
}

export interface PropertyImagesData {
	count: number
	items: PropertyImage[]
	offset: number
	total: number
}

export interface PropertyImage {
	id: string
	/** Owning property; null for orphaned/unlinked uploads. */
	property_id: string | null
	property_address: string | null
	image: string
	image_thumbnail: string
	image_medium: string
	image_large: string
	/** Gallery order (ascending). */
	sort: number
}

/** Admin can only relink/reorder images — uploads happen in the app. */
export interface UpdatePropertyImageDto {
	sort?: number
	property_id?: string | null
}

export interface CashOffersEmailsData {
	count: number
	items: CashOffersEmail[]
	offset: number
	total: number
}

export interface CashOffersEmail {
	id: string
	email: string
	name: string
	/** Group the subscription is scoped to; null = all properties. */
	group_id: number | null
	group_name: string | null
	is_active: boolean
	created_at: string
}

export interface CreateCashOffersEmailDto {
	email: string
	name: string
	/** null subscribes the address to all properties. */
	group_id: number | null
	is_active: boolean
}

export type UpdateCashOffersEmailDto = Partial<CreateCashOffersEmailDto>
