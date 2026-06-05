import type { ValueType } from './common'

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
