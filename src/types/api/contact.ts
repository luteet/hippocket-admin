export interface ContactsData {
	count: number
	items: Contact[]
	offset: number
	total: number
}

export interface Contact {
	id: string
	/** Email of the agent (or partner) who owns the contact. */
	owner: string
	/** Owning agent. Exactly one of `user_id` / `partner_user_id` is set. */
	user_id: string | null
	partner_user_id: string | null
	investor_user_id: string | null
	slug: string
	referral_code: string | null
	first_name: string
	last_name: string
	email: string
	phone: string
	/** Free-text classification (e.g. "Real Estate", "Mortgage"). */
	referral_type: string
	/** Free-text relationship (e.g. "Friend", "Client", "Family"). */
	relation_type: string
	address: string
	referrals_sent: number
	/** Creation timestamp (`YYYY-MM-DD HH:mm:ss.ffffff+00:00`). */
	date: string
	is_deleted: boolean
	deleted_at: string | null
}

/**
 * Payload for creating a contact (POST /contacts/). Exactly one of `user_id` /
 * `partner_user_id` must be set; the form sets `user_id` (an agent).
 */
export interface CreateContactDto {
	first_name: string
	last_name?: string
	user_id: string
	email: string
	phone?: string
	referral_type?: string
	relation_type?: string
	address?: string
}

/** Payload for updating a contact (PUT /contacts/{id}/). All fields optional. */
export interface UpdateContactDto {
	first_name?: string
	last_name?: string
	email?: string
	phone?: string
	referral_type?: string
	relation_type?: string
	address?: string
}
