import { DetailPage } from '@/components/detail/DetailPage'
import { DetailPageProvider } from '@/components/detail/DetailPageContext'
import { DetailBody } from '@/components/detail/DetailBody'
import { TimeAgo } from '@/components/TimeAgo'
import { useSharedPartnerDetailPage } from './useSharedPartnerDetailPage'
import { SharedPartnerEntriesTab } from './SharedPartnerEntriesTab'

export function SharedPartnerDetailPage() {
	const { shared, sharedId, ...detailCtx } = useSharedPartnerDetailPage()

	return (
		<DetailPageProvider value={detailCtx}>
			<DetailPage
				title="Shared Partner"
				deleteTitle="Delete shared partner?"
				deleteDescription={`The shared partner list for "${shared?.agent_email ?? ''}" will be permanently deleted.`}
				tabs={[
					{
						key: 'general',
						label: 'General',
						content: shared ? (
							<DetailBody
								fields={[
									{ label: 'Agent', value: shared.agent_email },
									{
										label: 'Partners',
										value: shared.entries.length,
									},
									{ label: 'ID', value: shared.id },
									{
										label: 'Created',
										render: (
											<TimeAgo value={shared.created_at} />
										),
									},
								]}
							/>
						) : null,
					},
					{
						key: 'entries',
						label: `Shared partners${shared ? ` (${shared.entries.length})` : ''}`,
						bare: true,
						content:
							sharedId && shared ? (
								<SharedPartnerEntriesTab
									sharedId={sharedId}
									entries={shared.entries}
								/>
							) : null,
					},
				]}
			/>
		</DetailPageProvider>
	)
}
