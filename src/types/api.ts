// Types derived from the example responses in the Postman collection (hippocket_admin.postman_collection.json).

export type ValueType = 'money' | 'tokens'

export interface TokenPair {
	access_token: string
	refresh_token: string
	token_type: 'bearer'
}

export interface PartnersData {
	count: number
	items: Partner[]
	offset: number
	total: number
}

export interface Partner {
	id: string
	slug: string
	name: string
	subtitle: string
	short_description: string
	description: string
	email: string
	phone: string
	website: string
	address: string
	is_hide: boolean
	is_hide_for_journey: boolean
	/** Display string shown to agents, e.g. "$50". May be null. */
	referral_fee: string | null
	potential_value: number | null
	value_type: ValueType
	agent_fee: number
	group_owner_fee: number
	hippocket_fee: number
	sms_notifications_enabled: boolean
	sms_phone: string
	video: string
	custom_keywords: string
	logo_url: string | null
	preview_url: string | null
	location_id: string
	location_name: string
	category_id: string
	category_name: string
	service_id: string
	service_name: string
	chosen_group_id: number
	chosen_group_name: string
	category_ids: string[]
	group_ids: number[]
	recommended_user_ids: string[]
	count_login: number
	/** ISO timestamp; null if the partner has never logged in. */
	last_login: string | null
	created_at: string
	updated_at: string
}

export interface CreatePartnerDto {
	name: string
	email: string
	subtitle?: string
	short_description?: string
	description?: string
	phone?: string
	website?: string
	address?: string
	agent_fee: number
	value_type: ValueType
	potential_value?: number | null
	group_owner_fee?: number
	hippocket_fee?: number
	sms_notifications_enabled?: boolean
	sms_phone?: string
	custom_keywords?: string
	is_hide_for_journey?: boolean
	location_id?: string
	category_id?: string
	service_id?: string
}

export interface UpdatePartnerDto {
	name?: string
	email?: string
	phone?: string
	subtitle?: string
	short_description?: string
	description?: string
	website?: string
	address?: string
	custom_keywords?: string
	agent_fee?: number
	is_hide?: boolean
	is_hide_for_journey?: boolean
	potential_value?: number | null
	value_type?: ValueType
	group_owner_fee?: number
	hippocket_fee?: number
	sms_notifications_enabled?: boolean
	sms_phone?: string
}

export interface PartnerReview {
	id: string
	partner_id: string
	name: string
	text: string
	avatar_url: string | null
	created_at: string
}

export interface CreatePartnerReviewDto {
	name: string
	text: string
}

export type UpdatePartnerReviewDto = CreatePartnerReviewDto

export interface Agent {
	id: string
	email: string
	first_name: string
	last_name: string
	phone: string
	is_active: boolean
	balance: number
	balance_coin: number
	chosen_group: string
}

export interface UpdateAgentDto {
	first_name?: string
	last_name?: string
	phone?: string
	chosen_group_slug?: string
}

export interface Group {
	id: number
	name: string
	slug: string
}

export interface ReferralListData {
	count: number
	items: ReferralListItem[]
	offset: number
	total: number
}

export interface ReferralListItem {
	id: string
	referral_name: string
	agent_email: string
	partner_name: string
	status: string
	is_paid: boolean
	potential_value: string
	created_at: string
}

export interface ReferralDetail extends ReferralListItem {
	agent_phone: string
	partner_email: string
	contact_email: string
	contact_phone: string
	group_name: string
	agent_potential_value: number
	partner_potential_value: number
	value_type: ValueType
}

export interface StatusData {
	count: number
	items: Status[]
	offset: number
	total: number
}

export interface Status {
	id: number
	name: string
	label: string
	priority: number
}

// Lightweight option from the reference-data (selects) endpoints, e.g. /refs/partners/.
export interface RefOption {
	id: string
	name: string
}

export type WithdrawalStatus = 'waiting' | 'success' | 'cancel'

export interface Withdrawal {
	id: string
	user_email: string
	amount: number
	method: string
	status: WithdrawalStatus
	created_at: string
}

export interface ApiError {
	detail: string
}

export interface PaginationParams {
	offset: number
	count: number
	search?: string
}
