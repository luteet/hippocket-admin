// Journey — Shared Partners: a curated partner list assigned to an agent
// (`agent_email`), backed by /shared-partners/ and its /entries/ sub-resource.
// The Postman collection documents the endpoints but ships no response
// examples; these shapes were captured live from the dev API.

/** One partner pinned to a shared list, with its presentation flags. */
export interface SharedPartnerEntry {
	id: string
	partner_id: string
	partner_name: string
	is_top_rated: boolean
	is_recommend: boolean
}

/** A shared-partner list owned by an agent (`agent_email`). */
export interface SharedPartner {
	id: string
	agent_email: string
	entries: SharedPartnerEntry[]
	created_at: string
}

export interface SharedPartnersData {
	count: number
	items: SharedPartner[]
	offset: number
	total: number
}

/** POST/PUT /shared-partners/ — both take just the owning agent's email. */
export interface SharedPartnerDto {
	agent_email: string
}

export type CreateSharedPartnerDto = SharedPartnerDto
export type UpdateSharedPartnerDto = SharedPartnerDto

/** POST /shared-partners/{id}/entries/ — pin a partner with its flags. */
export interface CreateSharedPartnerEntryDto {
	partner_id: string
	is_top_rated: boolean
	is_recommend: boolean
}

/** PUT /shared-partners/{id}/entries/{entryId}/ — the flags are editable;
 *  the pinned partner itself is fixed once added. */
export interface UpdateSharedPartnerEntryDto {
	is_top_rated?: boolean
	is_recommend?: boolean
}
