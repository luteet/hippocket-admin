import { Link } from 'react-router'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { DetailGrid, DetailRow } from '@/components/DetailList'
import { useWithdrawalDetailPage } from './useWithdrawalDetailPage'
import {
	formatAmount,
	formatDateTime,
	methodLabel,
	STATUS_BADGE,
} from './format'

export function WithdrawalDetailPage() {
	const {
		withdrawal,
		isLoading,
		confirmOpen,
		setConfirmOpen,
		isDeleting,
		handleDelete,
		goBack,
		goToEdit,
	} = useWithdrawalDetailPage()

	return (
		<div>
			<Reveal index={0}>
				<PageHeader
					title="Withdrawal"
					actions={
						<>
							<Button
								variant="outline"
								onClick={goBack}
								aria-label="Back"
							>
								<Icon name="arrow-left" />
								<span className="sm:inline hidden">Back</span>
							</Button>
							{withdrawal && (
								<>
									<Button
										variant="secondary"
										onClick={goToEdit}
										aria-label="Edit"
									>
										<Icon name="pencil" />
										<span className="sm:inline hidden">
											Edit
										</span>
									</Button>
									<Button
										variant="destructive"
										onClick={() => setConfirmOpen(true)}
										aria-label="Delete"
									>
										<Icon name="trash-2" />
										<span className="sm:inline hidden">
											Delete
										</span>
									</Button>
								</>
							)}
						</>
					}
				/>
			</Reveal>

			<Card className="max-w-2xl">
				<CardContent className="pt-6">
					{isLoading || !withdrawal ? (
						<div className="space-y-3">
							<Skeleton className="h-6 w-1/2" />
							<Skeleton className="h-5 w-2/3" />
							<Skeleton className="h-5 w-1/3" />
						</div>
					) : (
						<Reveal index={1}>
							<div className="space-y-4">
								<div className="flex items-center justify-between gap-4">
									<div>
										<p className="text-xl font-semibold">
											{formatAmount(withdrawal.amount)}
										</p>
										<p className="pt-2 text-sm font-medium text-muted-foreground">
											{methodLabel(withdrawal.method)}
										</p>
									</div>
									<Badge
										variant={
											STATUS_BADGE[withdrawal.status]
										}
										className="capitalize"
									>
										{withdrawal.status}
									</Badge>
								</div>

								<Separator className="mt-8" />

								<DetailGrid className="mt-8">
									<DetailRow label="Agent">
										<Link
											to={`/agents/${withdrawal.user_id}`}
											className="text-primary underline underline-offset-[5px] transition-[filter] hover:brightness-110 active:brightness-90"
										>
											{withdrawal.user_full_name ||
												withdrawal.user_email}
										</Link>
									</DetailRow>
									<DetailRow
										label="Email"
										value={withdrawal.user_email}
									/>
									<DetailRow
										label="Amount"
										value={formatAmount(withdrawal.amount)}
									/>
									<DetailRow
										label="Method"
										value={methodLabel(withdrawal.method)}
									/>
									<DetailRow
										label="Status"
										value={withdrawal.status}
										capitalize
									/>
									<DetailRow
										label="Payment details"
										value={withdrawal.payment_details}
									/>
									<DetailRow
										label="PayPal"
										value={withdrawal.paypal_data}
									/>
									<DetailRow
										label="Venmo"
										value={withdrawal.venmo_id}
									/>
									<DetailRow
										label="Cash App"
										value={withdrawal.cash_app_info}
									/>
									<DetailRow
										label="Zelle"
										value={withdrawal.zelle}
									/>
									<DetailRow
										label="Created"
										value={formatDateTime(
											withdrawal.created_at,
										)}
									/>
								</DetailGrid>
							</div>
						</Reveal>
					)}
				</CardContent>
			</Card>

			<ConfirmDialog
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				title="Delete withdrawal?"
				description="This withdrawal request will be permanently deleted."
				confirmLabel="Delete"
				destructive
				loading={isDeleting}
				onConfirm={handleDelete}
			/>
		</div>
	)
}
