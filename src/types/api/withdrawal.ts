export type WithdrawalStatus = 'waiting' | 'success' | 'cancel'

export type WithdrawalMethod = 'paypal' | 'venmo' | 'cash_app' | 'zelle'

export interface Withdrawal {
	id: string
	user_id: string
	user_email: string
	user_full_name: string
	amount: number
	method: WithdrawalMethod
	status: WithdrawalStatus
	payment_details: string
	paypal_data: string
	venmo_id: string
	cash_app_info: string
	zelle: string
	created_at: string
}

export interface WithdrawalData {
	count: number
	items: Withdrawal[]
	offset: number
	total: number
}

export interface CreateWithdrawalDto {
	user_id: string
	amount: number
	method: WithdrawalMethod
	status: WithdrawalStatus
}

// Update has no user_id — a withdrawal can't be reassigned to another agent.
export interface UpdateWithdrawalDto {
	amount: number
	method: WithdrawalMethod
	status: WithdrawalStatus
}
