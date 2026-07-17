// Types for admin transactions (full CRUD + timeline).

// --- Referral (slot within a milestone) ---
export interface TransactionReferral {
	id: string
	milestone_id: string
	milestone_name: string
	partner_id: string
	partner_name: string
	send_datetime: string
	status: 'pending' | 'sent' | 'accepted' | 'declined' | 'failed'
	note: string
	sms_sid: string | null
	sent_at: string | null
	responded_at: string | null
	last_error: string | null
}

// --- Milestone (timeline entry on a transaction) ---
export interface TransactionMilestone {
	id: string
	name: string
	sort: number
	target_date: string
	referrals: TransactionReferral[]
}

// --- Transaction (list item / detail) ---
export interface Transaction {
	id: string
	property_address: string
	role: 'Buyer' | 'Seller'
	customer_name: string
	agent_id: string
	agent_email: string
	agent_display_name: string
	contract_date: string
	closing_date: string
	status: 'active' | 'closed'
	referrals_count: number
	partner_names: string[]
	created_at: string
	// Detail-only:
	milestones?: TransactionMilestone[]
}

// --- Paginated list response ---
export interface TransactionData {
	items: Transaction[]
	total: number
	offset: number
	count: number
}

// --- Create DTO ---
export interface CreateTransactionReferral {
	partner_id: string
	send_datetime: string
	milestone_name?: string
	note?: string
}

export interface CreateTransactionDto {
	agent_id: string
	property_address: string
	role: 'Buyer' | 'Seller'
	customer_name: string
	contract_date: string
	closing_date: string
	agent_display_name?: string
	referrals: CreateTransactionReferral[]
}

// --- Update DTO (all optional) ---
export interface UpdateTransactionDto {
	property_address?: string
	role?: 'Buyer' | 'Seller'
	customer_name?: string
	agent_display_name?: string
	contract_date?: string
	closing_date?: string
	status?: 'active' | 'closed'
	agent_id?: string
}

// --- Referral sub-resource DTOs ---
export interface CreateReferralDto {
	partner_id: string
	send_datetime: string
	milestone_name?: string
	note?: string
}

export interface UpdateMilestoneDto {
	name?: string
	sort?: number
	target_date?: string
}

export interface UpdateTransactionReferralDto {
	partner_id?: string
	send_datetime?: string
	status?: 'pending' | 'sent' | 'accepted' | 'declined' | 'failed'
	note?: string
}

// --- Query params for the list endpoint ---
export interface TransactionFilters {
	offset: number
	count: number
	search?: string
	status?: 'active' | 'closed'
	role?: 'Buyer' | 'Seller'
	agent_id?: string
	partner_id?: string
	created_from?: string
	created_to?: string
	sort_by?: string
	order?: 'asc' | 'desc'
}
