import { Link } from 'react-router'

import { DetailPage } from '@/components/detail/DetailPage'
import { DetailPageProvider } from '@/components/detail/DetailPageContext'
import { DetailBody } from '@/components/detail/DetailBody'
import { TimeAgo } from '@/components/TimeAgo'
import { useChatDetailPage } from './useChatDetailPage'
import { ChatMessagesTab } from './ChatMessagesTab'

export function ChatDetailPage() {
	const { chat, chatId, ...detailCtx } = useChatDetailPage()

	return (
		<DetailPageProvider value={detailCtx}>
			<DetailPage
				title="Chat"
				deleteTitle="Delete chat?"
				deleteDescription={`The chat between "${chat?.user_list ?? ''}" and its messages will be permanently deleted.`}
				tabs={[
					{
						key: 'general',
						label: 'General',
						content: chat ? (
							<DetailBody
								fields={[
									{
										label: 'Participants',
										render: (
											<div className="flex flex-col gap-1">
												{chat.user_ids.map((uid, i) => (
													<Link
														key={uid}
														to={`/agents/${uid}`}
														className="link"
													>
														{chat.user_list.split(', ')[
															i
														] ?? uid}
													</Link>
												))}
											</div>
										),
									},
									{
										label: 'Messages',
										value: chat.messages_count,
									},
									{ label: 'Chat ID', value: chat.id },
									{
										label: 'Created',
										render: <TimeAgo value={chat.created_at} />,
									},
								]}
							/>
						) : null,
					},
					{
						key: 'messages',
						label: `Messages${chat ? ` (${chat.messages_count})` : ''}`,
						bare: true,
						content: chatId ? (
							<ChatMessagesTab chatId={chatId} />
						) : null,
					},
				]}
			/>
		</DetailPageProvider>
	)
}
