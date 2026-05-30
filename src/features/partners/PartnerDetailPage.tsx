import * as React from 'react'
import { useNavigate, useParams } from 'react-router'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { getApiErrorMessage } from '@/lib/api/client'
import { usePartner, useDeletePartner } from './hooks'
import { formatFee } from './format'

export function PartnerDetailPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: partner, isLoading } = usePartner(id)
	const deleteMut = useDeletePartner()
	const [confirmOpen, setConfirmOpen] = React.useState(false)

	const handleDelete = async () => {
		if (!id) return
		try {
			await deleteMut.mutateAsync(id)
			toast.success('Partner deleted')
			navigate('/partners')
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to delete'))
		}
	}

	return (
		<div>
			<PageHeader
				title="Partner"
				actions={
					<>
						<Button
							variant="outline"
							onClick={() => navigate('/partners')}
						>
							<ArrowLeft />
							Back
						</Button>
						{partner && (
							<>
								<Button
									variant="secondary"
									onClick={() =>
										navigate(`/partners/${id}/edit`)
									}
								>
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
								<p className="text-xl font-semibold">
									{partner.name}
								</p>
								{partner.is_hide ? (
									<Badge variant="muted">Hidden</Badge>
								) : (
									<Badge variant="success">Active</Badge>
								)}
							</div>

							<Separator />

							<dl className="grid grid-cols-1 gap-x-4 gap-y-3 text-sm sm:grid-cols-2">
								<Row label="Email" value={partner.email} />
								<Row label="Phone" value={partner.phone} />
								<Row label="Fee" value={formatFee(partner)} />
								<Row
									label="Value type"
									value={partner.value_type}
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
				loading={deleteMut.isPending}
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
