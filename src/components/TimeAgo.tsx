import { formatDateTime, formatRelativeTime } from '@/lib/format'

/**
 * Render a timestamp as relative time ("2 hours ago") with the full absolute
 * date-time available on hover (native `title`) and a machine-readable
 * `dateTime` attribute on the `<time>` element. Null renders the shared em-dash
 * placeholder with no tooltip. Recency scans far easier than absolute-only
 * dates in lists (logs, referrals, withdrawals, chats); keep `formatDateTime`
 * where a precise timestamp is the point.
 */
export function TimeAgo({
	value,
	className,
}: {
	value: string | null
	className?: string
}) {
	if (!value) return <span className={className}>—</span>

	const date = new Date(value.replace(' ', 'T'))
	const valid = !Number.isNaN(date.getTime())

	return (
		<time
			dateTime={valid ? date.toISOString() : undefined}
			title={formatDateTime(value)}
			className={className}
		>
			{formatRelativeTime(value)}
		</time>
	)
}
