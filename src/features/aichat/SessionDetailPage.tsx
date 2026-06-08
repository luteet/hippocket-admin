import { DetailPage } from '@/components/detail/DetailPage'
import { useSessionDetailPage } from './useSessionDetailPage'
import { formatDateTime } from './format'

export function SessionDetailPage() {
	const {
		session,
		isLoading,
		isDeleting,
		handleDelete,
		goBack,
		goToMessages,
	} = useSessionDetailPage()

	return (
		<DetailPage
			title="AI Chat Session"
			onBack={goBack}
			ready={Boolean(session)}
			isLoading={isLoading}
			actions={[
				{
					label: 'Messages',
					icon: 'message-square',
					onClick: goToMessages,
				},
			]}
			onDelete={handleDelete}
			deleteTitle="Delete session?"
			deleteDescription={`Session for "${session?.user_email ?? ''}" and its messages will be permanently deleted.`}
			isDeleting={isDeleting}
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
								value: formatDateTime(session.created_at),
							},
							{
								label: 'Updated',
								value: formatDateTime(session.updated_at),
							},
						]
					: undefined
			}
		/>
	)
}
