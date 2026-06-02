import { Loader2, CheckCircle2 } from 'lucide-react'

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useReferralDetailDialog } from './useReferralDetailDialog'

interface Props {
	referralId: string | null
	onOpenChange: (open: boolean) => void
}

export function ReferralDetailDialog({ referralId, onOpenChange }: Props) {
	const {
		data,
		isLoading,
		statuses,
		currentStatus,
		handleStatusChange,
		handleMarkPaid,
		isUpdatingStatus,
		isMarkingPaid,
	} = useReferralDetailDialog(referralId)

	return (
		<Dialog open={!!referralId} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[90svh] max-w-lg overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Pipeline Log</DialogTitle>
				</DialogHeader>

				{isLoading || !data ? (
					<div className="space-y-3">
						<Skeleton className="h-5 w-2/3" />
						<Skeleton className="h-5 w-1/2" />
						<Skeleton className="h-5 w-3/4" />
					</div>
				) : (
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-lg font-semibold">
									{data.referral_name}
								</p>
								<p className="text-sm text-muted-foreground">
									{data.created_at}
								</p>
							</div>
							{data.is_paid ? (
								<Badge variant="success">Paid</Badge>
							) : (
								<Badge variant="muted">Unpaid</Badge>
							)}
						</div>

						<Separator />

						<dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
							<Row label="Agent" value={data.agent_email} />
							<Row label="Agent phone" value={data.agent_phone} />
							<Row label="Partner" value={data.partner_name} />
							<Row
								label="Partner email"
								value={data.partner_email}
							/>
							<Row
								label="Contact (email)"
								value={data.contact_email}
							/>
							<Row
								label="Contact (phone)"
								value={data.contact_phone}
							/>
							<Row label="Group" value={data.group_name} />
							<Row
								label="Potential"
								value={data.potential_value}
							/>
							<Row
								label="Agent income"
								value={String(data.agent_potential_value)}
							/>
							<Row
								label="Partner income"
								value={String(data.partner_potential_value)}
							/>
						</dl>

						<Separator />

						<div className="space-y-2">
							<p className="text-sm font-medium">Status</p>
							<div className="flex items-center gap-2">
								<Select
									value={currentStatus}
									onValueChange={handleStatusChange}
									disabled={isUpdatingStatus}
								>
									<SelectTrigger className="max-w-xs">
										<SelectValue placeholder="Select a status" />
									</SelectTrigger>
									<SelectContent>
										{statuses?.items?.map((s) => (
											<SelectItem
												key={s.id}
												value={s.label}
											>
												{s.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{isUpdatingStatus && (
									<Loader2 className="size-4 animate-spin text-muted-foreground" />
								)}
							</div>
						</div>

						{!data.is_paid && (
							<Button
								variant="secondary"
								onClick={handleMarkPaid}
								disabled={isMarkingPaid}
							>
								{isMarkingPaid ? (
									<Loader2 className="animate-spin" />
								) : (
									<CheckCircle2 />
								)}
								Mark as paid
							</Button>
						)}
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}

function Row({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<dt className="text-xs text-muted-foreground">{label}</dt>
			<dd className="wrap-break-word">{value || '—'}</dd>
		</div>
	)
}
