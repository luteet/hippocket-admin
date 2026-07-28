import { DetailPage } from '@/components/detail/DetailPage'
import { DetailPageProvider } from '@/components/detail/DetailPageContext'
import { TimeAgo } from '@/components/TimeAgo'
import { useSessionDetailPage } from './useSessionDetailPage'

export function SessionDetailPage() {
	const { session, goToMessages, ...detailCtx } = useSessionDetailPage()

	return (
		<DetailPageProvider value={detailCtx}>
			<DetailPage
				title="AI Chat Session"
				deleteTitle="Delete session?"
				deleteDescription={`Session for "${session?.user_email ?? ''}" and its messages will be permanently deleted.`}
				actions={[
					{
						label: 'Messages',
						icon: 'message-square',
						onClick: goToMessages,
					},
				]}
				fields={
					session
						? [
								{ label: 'User', value: session.user_email },
								{ label: 'User ID', value: session.user_id },
								{
									label: 'Messages',
									value: session.messages_count,
								},
								{ label: 'Session ID', value: session.id },
								{
									label: 'Created',
									render: <TimeAgo value={session.created_at} />,
								},
								{
									label: 'Updated',
									render: <TimeAgo value={session.updated_at} />,
								},
							]
						: undefined
				}
			/>
		</DetailPageProvider>
	)
}
