import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'

import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { usePartnerDetailPage } from './usePartnerDetailPage'
import {
	formatAmount,
	formatDateTime,
	formatFee,
	valueTypeLabel,
} from './format'

export function PartnerDetailPage() {
	const {
		partner,
		isLoading,
		confirmOpen,
		setConfirmOpen,
		isDeleting,
		handleDelete,
		goBack,
		goToEdit,
	} = usePartnerDetailPage()

	return (
		<div>
			<PageHeader
				title="Partner"
				actions={
					<>
						<Button variant="outline" onClick={goBack}>
							<ArrowLeft />
							Back
						</Button>
						{partner && (
							<>
								<Button variant="secondary" onClick={goToEdit}>
									<Pencil />
									Edit
								</Button>
								<Button
									variant="destructive"
									onClick={() => setConfirmOpen(true)}
								>
									<Trash2 />
									Delete
								</Button>
							</>
						)}
					</>
				}
			/>

			<Card className="max-w-2xl">
				<CardContent className="pt-6">
					{isLoading || !partner ? (
						<div className="space-y-3">
							<Skeleton className="h-6 w-1/2" />
							<Skeleton className="h-5 w-2/3" />
							<Skeleton className="h-5 w-1/3" />
						</div>
					) : (
						<div className="space-y-4">
							<div className="flex items-center justify-between gap-4">
								<div>
									<p className="text-xl font-semibold">
										{partner.name}
									</p>
									{partner.subtitle && (
										<p className="text-sm text-muted-foreground">
											{partner.subtitle}
										</p>
									)}
								</div>
								{partner.is_hide ? (
									<Badge variant="muted">Hidden</Badge>
								) : (
									<Badge variant="success">Active</Badge>
								)}
							</div>

							{partner.description && (
								<p className="text-sm wrap-break-word whitespace-pre-line text-muted-foreground">
									{partner.description}
								</p>
							)}

							<Separator />

							<dl className="grid grid-cols-1 gap-x-4 gap-y-3 text-sm sm:grid-cols-2">
								<Row label="Email" value={partner.email} />
								<Row label="Phone" value={partner.phone} />
								<Row label="Website" value={partner.website} />
								<Row label="Address" value={partner.address} />
								<Row
									label="Category"
									value={partner.category_name}
								/>
								<Row
									label="Service"
									value={partner.service_name}
								/>
								<Row
									label="Location"
									value={partner.location_name}
								/>
								<Row
									label="Group"
									value={partner.chosen_group_name}
								/>
								<Row
									label="Referral fee"
									value={partner.referral_fee ?? ''}
								/>
								<Row
									label="Potential value"
									value={
										partner.potential_value != null
											? formatAmount(
													partner.potential_value,
													partner.value_type,
												)
											: ''
									}
								/>
								<Row
									label="Agent fee"
									value={formatFee(partner)}
								/>
								<Row
									label="Group owner fee"
									value={formatAmount(
										partner.group_owner_fee,
										partner.value_type,
									)}
								/>
								<Row
									label="Hippocket fee"
									value={formatAmount(
										partner.hippocket_fee,
										partner.value_type,
									)}
								/>
								<Row
									label="Value type"
									value={valueTypeLabel(partner.value_type)}
								/>
								<Row
									label="SMS notifications"
									value={
										partner.sms_notifications_enabled
											? 'On'
											: 'Off'
									}
								/>
								<Row
									label="SMS phone"
									value={partner.sms_phone}
								/>
								<Row
									label="Logins"
									value={String(partner.count_login)}
								/>
								<Row
									label="Last login"
									value={formatDateTime(partner.last_login)}
								/>
								<Row
									label="Created"
									value={formatDateTime(partner.created_at)}
								/>
								<Row
									label="Updated"
									value={formatDateTime(partner.updated_at)}
								/>
							</dl>
						</div>
					)}
				</CardContent>
			</Card>

			<ConfirmDialog
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				title="Delete partner?"
				description={`Partner "${partner?.name ?? ''}" will be permanently deleted.`}
				confirmLabel="Delete"
				destructive
				loading={isDeleting}
				onConfirm={handleDelete}
			/>
		</div>
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
