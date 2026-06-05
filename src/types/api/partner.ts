import type { ValueType } from './common'

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
	location_id?: string | null
	category_id?: string | null
	service_id?: string | null
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
	location_id?: string | null
	category_id?: string | null
	service_id?: string | null
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
