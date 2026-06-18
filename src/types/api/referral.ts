import type { ValueType } from './common'

export interface ReferralListData {
	count: number
	items: ReferralListItem[]
	offset: number
	total: number
	total_pipeline_potential: number
}

export interface ReferralListItem {
	id: string
	referral_name: string
	agent_email: string
	partner_id: string
	partner_name: string
	status: string
	is_paid: boolean
	potential_value: string
	group_id: number | null
	group_name: string | null
	created_at: string
}

export interface ReferralDetail extends ReferralListItem {
	status_id: number
	agent_id: string
	agent_phone: string
	partner_email: string
	contact_id: string
	contact_email: string
	contact_phone: string
	group_id: number
	group_name: string
	agent_potential_value: number
	partner_potential_value: number
	update_balance: number
	final_balance: number
	coin_course: number
	value_type: ValueType
}

/**
 * Payload for the general referral update (PUT /referrals/{id}/). Mirrors the
 * "Update Referral (general)" example in the Postman collection. There is no
 * create endpoint — referrals originate agent-side — so this is edit-only.
 */
export interface UpdateReferralDto {
	referral_name: string
	status_id: number
	is_paid: boolean
	potential_value: string
	value_type: ValueType
	agent_potential_value: number
	partner_potential_value: number
	coin_course: number
	referral_partner_id: string
	referral_group_id: number
	contact_id: string
}
