import { Link } from 'react-router'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { DetailPage } from '@/components/detail/DetailPage'
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
		isDeleting,
		handleDelete,
		goBack,
		goToEdit,
	} = useReferralDetailPage()

	const statusName =
		statuses?.items.find((s) => s.label === referral?.status)?.name ??
		referral?.status

	return (
		<DetailPage
			title="Referral"
			onBack={goBack}
			ready={Boolean(referral)}
			isLoading={isLoading}
			onEdit={goToEdit}
			onDelete={handleDelete}
			deleteTitle="Delete referral?"
			deleteDescription={`Referral "${referral?.referral_name ?? ''}" will be permanently deleted.`}
			isDeleting={isDeleting}
			heading={
				referral
					? {
							title: referral.referral_name,
							subtitle: formatDateTime(referral.created_at),
							badge: referral.is_paid ? (
								<Badge variant="success">Paid</Badge>
							) : (
								<Badge variant="muted">Unpaid</Badge>
							),
						}
					: undefined
			}
			fields={
				referral
					? [
							{
								label: 'Status',
								render: (
									<Badge variant="outline">
										{statusName}
									</Badge>
								),
							},
							{ label: 'Agent', value: referral.agent_email },
							{
								label: 'Agent phone',
								value: referral.agent_phone,
							},
							{
								label: 'Partner',
								render: (
									<Link
										to={`/partners/${referral.partner_id}`}
										className="text-primary underline underline-offset-[5px] transition-[filter] hover:brightness-110 active:brightness-90"
									>
										{referral.partner_name}
									</Link>
								),
							},
							{
								label: 'Partner email',
								value: referral.partner_email,
							},
							{
								label: 'Contact (email)',
								value: referral.contact_email,
							},
							{
								label: 'Contact (phone)',
								value: referral.contact_phone,
							},
							{ label: 'Group', value: referral.group_name },
							{
								label: 'Potential',
								value: referral.potential_value,
							},
							{
								label: 'Value type',
								value: valueTypeLabel(referral.value_type),
							},
							{
								label: 'Agent income',
								value: referral.agent_potential_value,
							},
							{
								label: 'Partner income',
								value: referral.partner_potential_value,
							},
							{
								label: 'Coin course',
								value: referral.coin_course,
							},
							{
								label: 'Created',
								value: formatDateTime(referral.created_at),
							},
						]
					: undefined
			}
		>
			{referral && (
				<>
					<Separator className="mt-8" />

					<div className="space-y-2">
						<p className="text-sm font-medium">Change status</p>
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
										<SelectItem key={s.id} value={s.label}>
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
							Changing the status here triggers the related side
							effects (notifications).
						</p>
					</div>

					{!referral.is_paid && (
						<Button
							variant="secondary"
							onClick={handleMarkPaid}
							disabled={isMarkingPaid}
						>
							{isMarkingPaid ? (
								<Icon name="loader" className="animate-spin" />
							) : (
								<Icon name="circle-check" />
							)}
							Mark as paid
						</Button>
					)}
				</>
			)}
		</DetailPage>
	)
}
