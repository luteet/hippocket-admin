import { AnimatePresence } from 'motion/react'

import { Icon } from '@/components/Icon'
import { PageTransition } from '@/components/PageTransition'
import { PageHeader } from '@/components/layout/PageHeader'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { DetailGrid, DetailRow } from '@/components/DetailList'
import { TabButton } from '@/components/TabButton'
import { PartnerReviewsTab } from './PartnerReviewsTab'
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
		partnerId,
		isLoading,
		tab,
		setTab,
		confirmOpen,
		setConfirmOpen,
		isDeleting,
		handleDelete,
		goBack,
		goToEdit,
	} = usePartnerDetailPage()

	return (
		<div>
			<Reveal index={0}>
				<PageHeader
					title="Partner"
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
							{partner && (
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

			<Reveal index={1}>
				<div className="mb-6 flex gap-1 border-b border-border">
					<TabButton
						active={tab === 'details'}
						onClick={() => setTab('details')}
					>
						Details
					</TabButton>
					<TabButton
						active={tab === 'reviews'}
						onClick={() => setTab('reviews')}
					>
						Reviews
					</TabButton>
				</div>

				<AnimatePresence mode="wait" initial={false}>
					<PageTransition key={tab}>
						{tab === 'reviews' ? (
							partnerId && (
								<PartnerReviewsTab partnerId={partnerId} />
							)
						) : (
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
														<p className="pt-2 text-sm font-medium">
															{partner.subtitle}
														</p>
													)}
												</div>
												{partner.is_hide ? (
													<Badge variant="muted">
														Hidden
													</Badge>
												) : (
													<Badge variant="success">
														Active
													</Badge>
												)}
											</div>

											{partner.description && (
												<p className="text-sm wrap-break-word whitespace-pre-line text-muted-foreground">
													{partner.description}
												</p>
											)}

											<Separator className="mt-8" />

											<DetailGrid className="mt-8">
												<DetailRow
													label="Email"
													value={partner.email}
												/>
												<DetailRow
													label="Phone"
													value={partner.phone}
												/>
												<DetailRow
													label="Website"
													value={partner.website}
												/>
												<DetailRow
													label="Address"
													value={partner.address}
												/>
												<DetailRow
													label="Category"
													value={
														partner.category_name
													}
												/>
												<DetailRow
													label="Service"
													value={partner.service_name}
												/>
												<DetailRow
													label="Location"
													value={
														partner.location_name
													}
												/>
												<DetailRow
													label="Group"
													value={
														partner.chosen_group_name
													}
												/>
												<DetailRow
													label="Referral fee"
													value={
														partner.referral_fee ??
														''
													}
												/>
												<DetailRow
													label="Potential value"
													value={
														partner.potential_value !=
														null
															? formatAmount(
																	partner.potential_value,
																	partner.value_type,
																)
															: ''
													}
												/>
												<DetailRow
													label="Agent fee"
													value={formatFee(partner)}
												/>
												<DetailRow
													label="Group owner fee"
													value={formatAmount(
														partner.group_owner_fee,
														partner.value_type,
													)}
												/>
												<DetailRow
													label="Hippocket fee"
													value={formatAmount(
														partner.hippocket_fee,
														partner.value_type,
													)}
												/>
												<DetailRow
													label="Value type"
													value={valueTypeLabel(
														partner.value_type,
													)}
												/>
												<DetailRow
													label="SMS notifications"
													value={
														partner.sms_notifications_enabled
															? 'On'
															: 'Off'
													}
												/>
												<DetailRow
													label="SMS phone"
													value={partner.sms_phone}
												/>
												<DetailRow
													label="Logins"
													value={String(
														partner.count_login,
													)}
												/>
												<DetailRow
													label="Last login"
													value={formatDateTime(
														partner.last_login,
													)}
												/>
												<DetailRow
													label="Created"
													value={formatDateTime(
														partner.created_at,
													)}
												/>
												<DetailRow
													label="Updated"
													value={formatDateTime(
														partner.updated_at,
													)}
												/>
											</DetailGrid>
										</div>
									)}
								</CardContent>
							</Card>
						)}
					</PageTransition>
				</AnimatePresence>
			</Reveal>

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
