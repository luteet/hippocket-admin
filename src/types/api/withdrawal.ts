export type WithdrawalStatus = 'waiting' | 'success' | 'cancel'

export interface Withdrawal {
	id: string
	user_email: string
	amount: number
	method: string
	status: WithdrawalStatus
	created_at: string
}
