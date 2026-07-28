import { Badge } from '@/components/ui/badge'
import { DetailPage } from '@/components/detail/DetailPage'
import { DetailPageProvider } from '@/components/detail/DetailPageContext'
import { MediaThumbnail } from '@/components/media/MediaThumbnail'
import { useAgentDetailPage } from './useAgentDetailPage'
import { chosenGroupName, formatDateTime, fullName } from './format'

export function AgentDetailPage() {
	const { agent, ...detailCtx } = useAgentDetailPage()

	return (
		<DetailPageProvider value={detailCtx}>
			<DetailPage
				title="Agent"
				deleteTitle="Delete agent?"
				deleteDescription={`Agent "${agent?.email ?? ''}" will be permanently deleted.`}
				heading={
					agent
						? {
								title: fullName(agent.first_name, agent.last_name),
								subtitle: agent.email,
								avatar: agent.avatar_url ? (
									<MediaThumbnail
										url={agent.avatar_url}
										shape="circle"
										placeholderIcon="user"
									/>
								) : undefined,
								badge: (
									<Badge
										variant={
											agent.is_active
												? 'success'
												: 'muted'
										}
									>
										{agent.is_active ? 'Active' : 'Inactive'}
									</Badge>
								),
							}
						: undefined
				}
				fields={
					agent
						? [
								{ label: 'First name', value: agent.first_name },
								{ label: 'Last name', value: agent.last_name },
								{ label: 'Email', value: agent.email },
								{ label: 'Phone', value: agent.phone },
								{
									label: 'Group',
									value: chosenGroupName(
										agent.chosen_group_id,
										agent.groups,
									) ?? '',
								},
								{
									label: 'Registration',
									value: agent.registration_date ?? '',
								},
								{
									label: 'Created',
									value: formatDateTime(agent.created_at),
								},
							]
						: undefined
				}
			/>
		</DetailPageProvider>
	)
}
