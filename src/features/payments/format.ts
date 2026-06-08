export { formatDateTime } from '@/lib/format'

// API codes come hyphen/underscore separated (`buyer-consultation`, `stripe`);
// turn them into Title Case for the table, filters, and detail fields.
export function titleizeSlug(value: string): string {
	return value
		.split(/[-_]/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ')
}

// `amount_dollars` is a plain number of dollars — render it as USD currency.
export function formatAmount(amountDollars: number): string {
	return amountDollars.toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
	})
}
