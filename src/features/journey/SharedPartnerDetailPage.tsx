import { DetailPage } from '@/components/detail/DetailPage'
import { DetailBody } from '@/components/detail/DetailBody'
import { useSharedPartnerDetailPage } from './useSharedPartnerDetailPage'
import { SharedPartnerEntriesTab } from './SharedPartnerEntriesTab'
import { formatDateTime } from './format'

export function SharedPartnerDetailPage() {
	const {
		shared,
		sharedId,
		isLoading,
		tab,
		setTab,
		isDeleting,
		handleDelete,
		goBack,
		goToEdit,
	} = useSharedPartnerDetailPage()

	return (
		<DetailPage
			title="Shared Partner"
			onBack={goBack}
			ready={Boolean(shared)}
			isLoading={isLoading}
			onEdit={goToEdit}
			onDelete={handleDelete}
			deleteTitle="Delete shared partner?"
			deleteDescription={`The shared partner list for "${shared?.agent_email ?? ''}" will be permanently deleted.`}
			isDeleting={isDeleting}
			activeTab={tab}
			onTabChange={(key) => setTab(key as typeof tab)}
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
									value: formatDateTime(shared.created_at),
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
	)
}
