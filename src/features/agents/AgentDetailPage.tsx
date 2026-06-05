import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { DetailGrid, DetailRow } from '@/components/DetailList'
import { useAgentDetailPage } from './useAgentDetailPage'
import { chosenGroupName, formatDateTime, fullName } from './format'

export function AgentDetailPage() {
	const { agent, isLoading, goBack, goToEdit } = useAgentDetailPage()

	return (
		<div>
			<PageHeader
				title="Agent"
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
						{agent && (
							<Button
								variant="secondary"
								onClick={goToEdit}
								aria-label="Edit"
							>
								<Icon name="pencil" />
								<span className="sm:inline hidden">Edit</span>
							</Button>
						)}
					</>
				}
			/>

			<Card className="max-w-2xl">
				<CardContent className="pt-6">
					{isLoading || !agent ? (
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
										{fullName(
											agent.first_name,
											agent.last_name,
										) || agent.email}
									</p>
									<p className="pt-2 text-sm font-medium text-muted-foreground">
										{agent.email}
									</p>
								</div>
								{agent.is_active ? (
									<Badge variant="success">Active</Badge>
								) : (
									<Badge variant="muted">Inactive</Badge>
								)}
							</div>

							<Separator className="mt-8" />

							<DetailGrid className="mt-8">
								<DetailRow
									label="Username"
									value={agent.username}
								/>
								<DetailRow label="Phone" value={agent.phone} />
								<DetailRow
									label="Role"
									value={agent.role}
									capitalize
								/>
								<DetailRow
									label="Status"
									value={agent.status}
									capitalize
								/>
								<DetailRow
									label="Company"
									value={agent.company}
								/>
								<DetailRow
									label="Address"
									value={agent.address}
								/>
								<DetailRow
									label="Groups"
									value={agent.group_names.join(', ')}
								/>
								<DetailRow
									label="Chosen group"
									value={chosenGroupName(agent)}
								/>
								<DetailRow
									label="Balance"
									value={`$${agent.balance.toFixed(2)}`}
								/>
								<DetailRow
									label="Token balance"
									value={String(agent.balance_coin)}
								/>
								<DetailRow
									label="Referral code"
									value={agent.referral_code ?? ''}
								/>
								<DetailRow
									label="License number"
									value={agent.license_number}
								/>
								<DetailRow
									label="PayPal"
									value={agent.paypal_data}
								/>
								<DetailRow
									label="Venmo"
									value={agent.venmo_id}
								/>
								<DetailRow
									label="Cash App"
									value={agent.cash_app_info}
								/>
								<DetailRow label="Zelle" value={agent.zelle} />
								<DetailRow
									label="New user"
									bool={agent.is_new_user}
								/>
								<DetailRow
									label="Default admin"
									bool={agent.default_admin}
								/>
								<DetailRow
									label="Hidden"
									bool={agent.is_hide}
								/>
								<DetailRow
									label="Logins"
									value={String(agent.count_login)}
								/>
								<DetailRow
									label="Pending email"
									value={agent.pending_email ?? ''}
								/>
								<DetailRow
									label="Last login"
									value={formatDateTime(agent.last_login)}
								/>
								<DetailRow
									label="Created"
									value={formatDateTime(agent.created_at)}
								/>
								<DetailRow
									label="Updated"
									value={formatDateTime(agent.updated_at)}
								/>
							</DetailGrid>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
