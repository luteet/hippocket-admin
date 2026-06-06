// The API returns machine-style codes (`referral_sent`, `send_status: "send"`);
// turn them into Title Case labels for the table and filter selects.
export function formatLogLabel(value: string): string {
	return value
		.split('_')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ')
}
