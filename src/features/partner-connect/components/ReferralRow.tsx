import type { TransactionReferral } from "@/types/api"
import { capitalize, formatDateTime } from "../format"
import { Badge } from "@/components/ui/badge"

/** A single referral slot within a milestone. */
export default function ReferralRow({
	referral,
}: {
	referral: TransactionReferral
}) {
	const statusLabel = capitalize(referral.status)
	const statusBadge = {
		pending: <Badge variant="outline">{statusLabel}</Badge>,
		sent: <Badge variant="warning">{statusLabel}</Badge>,
		accepted: <Badge variant="success">{statusLabel}</Badge>,
		declined: <Badge variant="destructive">{statusLabel}</Badge>,
		failed: <Badge variant="destructive">{statusLabel}</Badge>,
	}[referral.status] ?? <Badge variant="outline">{statusLabel}</Badge>

	return (
		<div className="rounded-lg border border-border bg-muted/30 p-4 text-sm">
			<div className="flex items-center justify-between gap-4">
				<div>
					<span className="font-medium">{referral.partner_name}</span>
					{referral.note && (
						<p className="mt-1 text-muted-foreground">
							{referral.note}
						</p>
					)}
				</div>
				{statusBadge}
			</div>
			<div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
				<span>
					Send:{' '}
					{formatDateTime(
						referral.send_datetime?.replace('Z', '') ?? null,
					)}
				</span>
				{referral.sent_at && (
					<span>
						Sent: {formatDateTime(referral.sent_at.replace('Z', ''))}
					</span>
				)}
				{referral.responded_at && (
					<span>
						Responded:{' '}
						{formatDateTime(
							referral.responded_at.replace('Z', ''),
						)}
					</span>
				)}
				{referral.last_error && (
					<span className="text-destructive">
						Error: {referral.last_error}
					</span>
				)}
			</div>
		</div>
	)
}
