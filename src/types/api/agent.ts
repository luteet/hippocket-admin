export interface AgentsData {
	count: number
	items: Agent[]
	offset: number
	total: number
}

/** Agent's `role` — the kind of account. */
export type AgentRole = 'source' | 'partner' | 'buyer'

/** Agent's `status` — the sub-type within a role. */
export type AgentStatus =
	| 'agent'
	| 'apartment'
	| 'real'
	| 'service'
	| 'referral'

export interface Agent {
	id: string
	email: string
	username: string
	first_name: string
	last_name: string
	phone: string
	company: string
	address: string
	role: AgentRole
	status: AgentStatus
	is_active: boolean
	is_hide: boolean
	is_new_user: boolean
	default_admin: boolean
	balance: number
	balance_coin: number
	pending_email: string | null
	chosen_group_id: number | null
	chosen_group_slug: string | null
	group_ids: number[]
	group_names: string[]
	paypal_data: string
	venmo_id: string
	cash_app_info: string
	zelle: string
	license_number: string
	referral_code: string | null
	count_login: number
	upload_contact: number
	count_chat_messages: number
	/** ISO timestamp; null if the agent has never logged in. */
	last_login: string | null
	avatar_url: string | null
	created_at: string
	updated_at: string
}

/**
 * Payload for creating an agent (POST /agents/). Mirrors the "Create Agent"
 * example in the Postman collection. Internal counters (count_login, …) and
 * `password_hash` are server-managed and intentionally omitted.
 */
export interface CreateAgentDto {
	email: string
	password: string
	username?: string
	first_name?: string
	last_name?: string
	phone?: string
	company?: string
	address?: string
	role: AgentRole
	status: AgentStatus
	is_active: boolean
	is_hide: boolean
	is_new_user: boolean
	default_admin: boolean
	balance: number
	balance_coin: number
	chosen_group_id: number | null
	group_ids: number[]
	paypal_data?: string
	venmo_id?: string
	cash_app_info?: string
	zelle?: string
	license_number?: string
	referral_code?: string | null
	pending_email?: string | null
}

/**
 * Payload for updating an agent (PUT /agents/{id}/). All fields optional;
 * `password` is sent only when changing it (omit to keep the current one).
 * `email` isn't part of the update — it changes via the pending-email flow.
 */
export interface UpdateAgentDto {
	username?: string
	first_name?: string
	last_name?: string
	phone?: string
	company?: string
	address?: string
	role?: AgentRole
	status?: AgentStatus
	is_active?: boolean
	is_new_user?: boolean
	balance?: number
	balance_coin?: number
	chosen_group_id?: number | null
	group_ids?: number[]
	paypal_data?: string
	venmo_id?: string
	cash_app_info?: string
	zelle?: string
	license_number?: string
	pending_email?: string | null
	password?: string
}
