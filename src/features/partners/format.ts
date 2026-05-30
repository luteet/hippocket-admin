import type { Partner } from '@/types/api'

export function formatFee(partner: Partner) {
	return partner.value_type === 'money'
		? `$${partner.agent_fee.toFixed(2)}`
		: `${partner.agent_fee} coins`
}
