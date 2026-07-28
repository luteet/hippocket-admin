import { DetailPage } from '@/components/detail/DetailPage'
import { DetailPageProvider } from '@/components/detail/DetailPageContext'
import { TimeAgo } from '@/components/TimeAgo'
import { useChatMediaDetailPage } from './useChatMediaDetailPage'
import { isImage, mediaUrl } from './format'
import { MediaFileLink } from './components/MediaFileLink'

export function ChatMediaDetailPage() {
	const { media, goToMessage, ...detailCtx } = useChatMediaDetailPage()

	return (
		<DetailPageProvider value={detailCtx}>
			<DetailPage
				title="Chat Media"
				deleteTitle="Delete media?"
				deleteDescription="This file will be permanently deleted."
				actions={
					media?.message_id
						? [
								{
									label: 'Open message',
									icon: 'message-square',
									onClick: goToMessage,
								},
							]
						: undefined
				}
				intro={
					media &&
					isImage(media.file) && (
						<a
							href={mediaUrl(media.file)}
							target="_blank"
							rel="noreferrer"
						>
							<img
								src={mediaUrl(media.file)}
								alt="Chat media preview"
								className="max-h-80 w-auto rounded-md border border-border object-contain"
							/>
						</a>
					)
				}
				fields={
					media
						? [
								{
									label: 'File',
									render: <MediaFileLink file={media.file} />,
								},
								{ label: 'Uploaded by', value: media.user_email },
								media.message_id
									? {
											label: 'Message',
											render: (
												<button
													type="button"
													onClick={goToMessage}
													className="text-left text-primary underline-offset-2 hover:underline"
												>
													Open message
												</button>
											),
										}
									: { label: 'Message' },
								{ label: 'Media ID', value: media.id },
								{
									label: 'Created',
									render: <TimeAgo value={media.created_at} />,
								},
							]
						: undefined
				}
			/>
		</DetailPageProvider>
	)
}
