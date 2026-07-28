import { Link } from 'react-router'

import { Badge } from '@/components/ui/badge'
import { DetailPage } from '@/components/detail/DetailPage'
import { DetailBody } from '@/components/detail/DetailBody'
import { SectionTitle } from '@/components/SectionTitle'
import type { TransactionMilestone } from '@/types/api'
import { capitalize, formatDateTime } from './format'
import { usePartnerConnectDetailPage } from './usePartnerConnectDetailPage'
import MilestoneCard from './components/MilestoneCard'

/** The timeline tab: list of milestones with referrals. */
function TimelineTab({
	milestones,
}: {
	milestones: TransactionMilestone[]
}) {
	return (
		<div className="space-y-6">
			{milestones.map((ms) => (
				<MilestoneCard key={ms.id} milestone={ms} />
			))}
			{milestones.length === 0 && (
				<p className="text-sm text-muted-foreground">
					No milestones yet.
				</p>
			)}
		</div>
	)
}

export function PartnerConnectDetailPage() {
	const {
		transaction,
		isLoading,
		tab,
		setTab,
		isDeleting,
		handleDelete,
		goBack,
		goToEdit,
	} = usePartnerConnectDetailPage()

	return (
		<DetailPage
			title="Partner Connect"
			onBack={goBack}
			ready={Boolean(transaction)}
			isLoading={isLoading}
			onEdit={goToEdit}
			onDelete={handleDelete}
			deleteTitle="Delete partner connect?"
			deleteDescription={`Partner connect "${transaction?.property_address ?? ''}" will be permanently deleted along with its milestones and referrals.`}
			isDeleting={isDeleting}
			activeTab={tab}
			onTabChange={(key) => setTab(key as typeof tab)}
			tabs={
				transaction
					? [
						{
							key: 'details',
							label: 'Details',
							content: (
								<DetailBody
									heading={{
										title:
											transaction.property_address ||
											'Untitled',
										subtitle: `${capitalize(transaction.role)} · ${capitalize(transaction.status)}`,
										badge: (
											<Badge
												variant={
													transaction.status ===
														'active'
														? 'success'
														: 'muted'
												}
											>
												{capitalize(
													transaction.status,
												)}
											</Badge>
										),
									}}
									fields={[
										{
											label: 'Customer',
											value:
												transaction.customer_name,
										},
										{
											label: 'Agent',
											render: transaction
												.agent_email ? (
												<Link
													to={`/agents/${transaction.agent_id}`}
													className="link"
												>
													{
														transaction.agent_email
													}
												</Link>
											) : (
												'—'
											),
										},
										{
											label: 'Agent display name',
											value:
												transaction.agent_display_name ||
												'—',
										},
										{
											label: 'Role',
											value: capitalize(
												transaction.role,
											),
										},
										{
											label: 'Contract date',
											value:
												transaction.contract_date ||
												'—',
										},
										{
											label: 'Closing date',
											value:
												transaction.closing_date ||
												'—',
										},
										{
											label: 'Referral slots',
											value: String(
												transaction.referrals_count,
											),
										},
										{
											label: 'Partners',
											render:
												transaction.partner_names
													.length > 0 ? (
													<div className="flex flex-wrap gap-1">
														{transaction.partner_names.map(
															(n, i) => (
																<Badge
																	key={i}
																	variant="outline"
																>
																	{n}
																</Badge>
															),
														)}
													</div>
												) : (
													'—'
												),
										},
										{
											label: 'Partner Connect ID',
											value: transaction.id,
											fullWidth: true,
											copyable: true,
										},
										{
											label: 'Created',
											value: formatDateTime(
												transaction.created_at,
											),
										}
									]}
								/>
							),
						},
						{
							key: 'timeline',
							label: `Timeline (${(transaction.milestones ?? []).length})`,
							content: (
								<div>
									<SectionTitle>
										Milestones & Referrals
									</SectionTitle>
									<div className="mt-4">
										<TimelineTab
											milestones={
												transaction.milestones ?? []
											}
										/>
									</div>
								</div>
							),
						},
					]
					: undefined
			}
		/>
	)
}
