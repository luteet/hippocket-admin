import type { Partner, ValueType } from '@/types/api'

/** Human-readable label for a value type. */
export function valueTypeLabel(valueType: ValueType) {
	return valueType === 'money' ? 'Money' : 'Tokens'
}

/** Format an amount according to the partner's value type. */
export function formatAmount(amount: number, valueType: ValueType) {
	return valueType === 'money'
		? `$${amount.toFixed(2)}`
		: `${amount} tokens`
}

export function formatFee(partner: Partner) {
	return formatAmount(partner.agent_fee, partner.value_type)
}

/** Render an ISO/`YYYY-MM-DD HH:mm:ss` timestamp as a readable date-time. */
export function formatDateTime(value: string | null) {
	if (!value) return '—'
	const date = new Date(value.replace(' ', 'T'))
	if (Number.isNaN(date.getTime())) return value
	return date.toLocaleString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}
