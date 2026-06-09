import type { Property } from '@/types/api'

export { formatDateTime } from '@/lib/format'

/** "City, ST" — skips empty parts. */
export function formatLocation(property: Property): string {
	return [property.city, property.state].filter(Boolean).join(', ')
}

/** "$320,000" from the integer `our_offer`; empty when unset. */
export function formatOurOffer(value: number | null): string {
	return value != null ? `$${value.toLocaleString('en-US')}` : ''
}
