import type { Partner, ValueType } from '@/types/api'

export { formatDateTime } from '@/lib/format'

/** Human-readable label for a value type. */
export function valueTypeLabel(valueType: ValueType) {
	return valueType === 'money' ? 'Money' : 'Tokens'
}

/** Format an amount according to the partner's value type. */
export function formatAmount(amount: number, valueType: ValueType) {
	return valueType === 'money' ? `$${amount.toFixed(2)}` : `${amount} tokens`
}

export function formatFee(partner: Partner) {
	return formatAmount(partner.agent_fee, partner.value_type)
}
