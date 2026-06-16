import { Badge, type BadgeProps } from '@/components/ui/badge'
import type { AdminLogItem } from '@/types/api'
import { formatLogLabel } from '../format'

// sms_status → badge variant. Final states are coloured (delivered green,
// undelivered/failed red); the in-flight states (queued/sent/sending) stay
// neutral since the status is not final yet and dotted in later asynchronously.
const VARIANT: Record<string, BadgeProps['variant']> = {
	delivered: 'success',
	undelivered: 'destructive',
	failed: 'destructive',
	queued: 'muted',
	sent: 'muted',
	sending: 'muted',
}

const IN_FLIGHT = new Set(['queued', 'sent', 'sending'])

export function SmsStatusCell({ log }: { log: AdminLogItem }) {
	const status = log.sms_status
	// null → no SMS was attempted (partner has SMS disabled or no number).
	if (!status) return <span className="text-muted-foreground">—</span>

	const variant = VARIANT[status] ?? 'muted'
	const label = IN_FLIGHT.has(status) ? 'Sending…' : formatLogLabel(status)
	const showReason = variant === 'destructive' && log.sms_error_message

	return (
		<div className="space-y-1">
			<Badge variant={variant}>{label}</Badge>
			{showReason && (
				<p
					className="text-muted-foreground line-clamp-2 text-xs"
					title={log.sms_error_message ?? undefined}
				>
					{log.sms_error_message}
				</p>
			)}
		</div>
	)
}
