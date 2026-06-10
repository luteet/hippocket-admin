import { Link } from 'react-router'

import { DetailPage } from '@/components/detail/DetailPage'
import { TimeAgo } from '@/components/TimeAgo'
import { useChatMessageDetailPage } from './useChatMessageDetailPage'
import { ReadBadge } from './components/ReadBadge'
import { MediaFileLink } from './components/MediaFileLink'

export function ChatMessageDetailPage() {
	const {
		message,
		isLoading,
		isDeleting,
		handleDelete,
		goBack,
		goToEdit,
		goToChat,
	} = useChatMessageDetailPage()

	return (
		<DetailPage
			title="Chat Message"
			onBack={goBack}
			ready={Boolean(message)}
			isLoading={isLoading}
			onEdit={goToEdit}
			onDelete={handleDelete}
			deleteTitle="Delete message?"
			deleteDescription="This message will be permanently deleted."
			isDeleting={isDeleting}
			header={
				message && (
					<div className="flex items-center justify-between gap-4">
						<span className="text-sm font-medium">
							{message.user_email}
						</span>
						<ReadBadge isRead={message.is_read} />
					</div>
				)
			}
			fields={
				message
					? [
							{
								label: 'Author',
								render: (
									<Link
										to={`/agents/${message.user_id}`}
										className="link"
									>
										{message.user_email}
									</Link>
								),
							},
							{
								label: 'Chat',
								render: (
									<button
										type="button"
										onClick={goToChat}
										className="link"
									>
										Open chat
									</button>
								),
							},
							{
								label: 'Created',
								render: <TimeAgo value={message.created_at} />,
							},
							{ label: 'Message ID', value: message.id },
						]
					: undefined
			}
		>
			{message && (
				<>
					<div>
						<p className="text-xs text-muted-foreground">Text</p>
						<pre className="mt-2 max-h-96 overflow-auto rounded-md border border-border bg-muted/40 p-3 text-sm whitespace-pre-wrap wrap-break-word font-sans">
							{message.text || '—'}
						</pre>
					</div>

					{message.files.length > 0 && (
						<div>
							<p className="text-xs text-muted-foreground">
								Files
							</p>
							<ul className="mt-2 space-y-1">
								{message.files.map((file) => (
									<li key={file}>
										<MediaFileLink file={file} />
									</li>
								))}
							</ul>
						</div>
					)}
				</>
			)}
		</DetailPage>
	)
}
