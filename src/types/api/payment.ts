// Payments are read-only (the API mirrors Django admin: no create/update/delete).
// The list and detail endpoints return the same flat shape.
export interface Payment {
	id: string
	user_id: string
	user_email: string
	referral_name: string
	referral_type: string
	referral_partner: string | null
	// meta advertises token/stripe/paypal, but live data also has `coin` — keep
	// it a plain string rather than a closed union.
	payment_type: string
	// Smallest currency unit (cents); `amount_dollars` is the same value / 100.
	amount: number
	amount_dollars: number
	payment_intent_id: string | null
	form_name: string | null
	created_at: string
}

export interface PaymentData {
	count: number
	items: Payment[]
	offset: number
	total: number
}

// Filter option lists for the payments list page (/payments/meta/).
export interface PaymentsMeta {
	payment_types: string[]
	form_names: string[]
}
