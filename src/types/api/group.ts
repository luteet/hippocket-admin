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

/**
 * Payload for creating a group (POST /groups/). Mirrors the "Create Group"
 * example in the Postman collection. Read-only/computed fields (`count_*`,
 * `is_deleted`, `logo_url`, …) are server-managed and omitted.
 */
export interface CreateGroupDto {
	name: string
	slug: string
	title_logo: string
	color_accent: string
	color_primary: string
	color_secondary: string
	color_secondary_light: string
	color_text: string
	/** Agent UUIDs that administer the group. */
	admin_ids: string[]
}

/**
 * Payload for updating a group (PUT /groups/{id}/). `slug` is create-only — it
 * isn't part of the update example, so it's intentionally excluded here.
 */
export type UpdateGroupDto = Omit<CreateGroupDto, 'slug'>

// Lightweight group option from /refs/groups/ — note the numeric id (unlike the
// string-id `RefOption` taxonomy lists).
export interface GroupOption {
	id: number
	name: string
}

// Lightweight agent option from /refs/agents/ (string UUID id).
export interface AgentOption {
	id: string
	email: string
	name: string
}
