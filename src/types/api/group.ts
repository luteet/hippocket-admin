export interface GroupsData {
	count: number
	items: Group[]
	offset: number
	total: number
}

export interface Group {
	id: number
	name: string
	slug: string
	title_logo: string
	logo_url: string | null
	color_accent: string
	color_primary: string
	color_secondary: string
	color_secondary_light: string
	color_text: string
	count_people: number
	/** Note the API's spelling (`refferals`) — kept verbatim to match the wire. */
	count_close_refferals: number
	admin_ids: string[]
	is_deleted: boolean
	/** ISO timestamp; null unless the group is soft-deleted. */
	deleted_at: string | null
}

// Lightweight group option from /refs/groups/ — note the numeric id (unlike the
// string-id `RefOption` taxonomy lists).
export interface GroupOption {
	id: number
	name: string
}
