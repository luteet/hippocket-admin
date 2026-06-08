// A user's saved search. `value` is a freeform query-string (e.g.
// `beds-min=2&cities=Plano`), not JSON, despite the collection's example.
export interface SavedFilter {
	id: string
	user_id: string
	user_email: string
	title: string
	value: string
	created_at: string
}

export interface SavedFilterData {
	count: number
	items: SavedFilter[]
	offset: number
	total: number
}

export interface CreateSavedFilterDto {
	user_id: string
	title: string
	value: string
}

// Update can't reassign the owner — there's no user_id.
export interface UpdateSavedFilterDto {
	title: string
	value: string
}
