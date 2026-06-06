import type { WithdrawalMethod, WithdrawalStatus } from '@/types/api'

export { formatDateTime } from '@/lib/format'

/** Withdrawal amounts are always money (USD). */
export function formatAmount(amount: number) {
	return `$${amount.toFixed(2)}`
}

const METHOD_LABELS: Record<WithdrawalMethod, string> = {
	paypal: 'PayPal',
	venmo: 'Venmo',
	cash_app: 'Cash App',
	zelle: 'Zelle',
}

/** Human label for a payment method; falls back to the raw value. */
export function methodLabel(method: WithdrawalMethod) {
	return METHOD_LABELS[method] ?? method
}

/** Badge variant for each withdrawal status. */
export const STATUS_BADGE: Record<
	WithdrawalStatus,
	'success' | 'destructive' | 'warning'
> = {
	waiting: 'warning',
	success: 'success',
	cancel: 'destructive',
}
