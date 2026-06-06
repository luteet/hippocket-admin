import type { ValueType } from '@/types/api'

export { formatDateTime } from '@/lib/format'

/** Human-readable label for a value type. */
export function valueTypeLabel(valueType: ValueType) {
	return valueType === 'money' ? 'Money' : 'Tokens'
}
