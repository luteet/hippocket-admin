import { Link } from 'react-router'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { DetailGrid, DetailRow } from '@/components/DetailList'
import { useReferralDetailPage } from './useReferralDetailPage'
import { formatDateTime, valueTypeLabel } from './format'

export function ReferralDetailPage() {
	const {
		referral,
		isLoading,
		statuses,
		currentStatus,
		handleStatusChange,
		handleMarkPaid,
		isUpdatingStatus,
		isMarkingPaid,
		confirmOpen,
		setConfirmOpen,
		isDeleting,
		handleDelete,
		goBack,
		goToEdit,
	} = useReferralDetailPage()

	const statusName =
		statuses?.items.find((s) => s.label === referral?.status)?.name ??
		referral?.status

	return (
		<div>
			<PageHeader
				title="Referral"
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
						{referral && (
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

			<Card className="max-w-2xl">
				<CardContent className="pt-6">
					{isLoading || !referral ? (
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
										{referral.referral_name}
									</p>
									<p className="pt-2 text-sm font-medium text-muted-foreground">
										{formatDateTime(referral.created_at)}
									</p>
								</div>
								{referral.is_paid ? (
									<Badge variant="success">Paid</Badge>
								) : (
									<Badge variant="muted">Unpaid</Badge>
								)}
							</div>

							<Separator className="mt-8" />

							<DetailGrid className="mt-8">
								<DetailRow label="Status">
									<Badge variant="outline">
										{statusName}
									</Badge>
								</DetailRow>
								<DetailRow
									label="Agent"
									value={referral.agent_email}
								/>
								<DetailRow
									label="Agent phone"
									value={referral.agent_phone}
								/>
								<DetailRow label="Partner">
									<Link
										to={`/partners/${referral.partner_id}`}
										className="text-primary underline underline-offset-[5px] transition-[filter] hover:brightness-110 active:brightness-90"
									>
										{referral.partner_name}
									</Link>
								</DetailRow>
								<DetailRow
									label="Partner email"
									value={referral.partner_email}
								/>
								<DetailRow
									label="Contact (email)"
									value={referral.contact_email}
								/>
								<DetailRow
									label="Contact (phone)"
									value={referral.contact_phone}
								/>
								<DetailRow
									label="Group"
									value={referral.group_name}
								/>
								<DetailRow
									label="Potential"
									value={referral.potential_value}
								/>
								<DetailRow
									label="Value type"
									value={valueTypeLabel(referral.value_type)}
								/>
								<DetailRow
									label="Agent income"
									value={String(
										referral.agent_potential_value,
									)}
								/>
								<DetailRow
									label="Partner income"
									value={String(
										referral.partner_potential_value,
									)}
								/>
								<DetailRow
									label="Coin course"
									value={String(referral.coin_course)}
								/>
								<DetailRow
									label="Created"
									value={formatDateTime(referral.created_at)}
								/>
							</DetailGrid>

							<Separator className="mt-8" />

							<div className="space-y-2">
								<p className="text-sm font-medium">
									Change status
								</p>
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
										<Icon
											name="loader"
											className="size-4 animate-spin text-muted-foreground"
										/>
									)}
								</div>
								<p className="text-xs text-muted-foreground">
									Changing the status here triggers the
									related side effects (notifications).
								</p>
							</div>

							{!referral.is_paid && (
								<Button
									variant="secondary"
									onClick={handleMarkPaid}
									disabled={isMarkingPaid}
								>
									{isMarkingPaid ? (
										<Icon
											name="loader"
											className="animate-spin"
										/>
									) : (
										<Icon name="circle-check" />
									)}
									Mark as paid
								</Button>
							)}
						</div>
					)}
				</CardContent>
			</Card>

			<ConfirmDialog
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				title="Delete referral?"
				description={`Referral "${referral?.referral_name ?? ''}" will be permanently deleted.`}
				confirmLabel="Delete"
				destructive
				loading={isDeleting}
				onConfirm={handleDelete}
			/>
		</div>
	)
}
