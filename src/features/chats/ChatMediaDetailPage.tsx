import { DetailPage } from '@/components/detail/DetailPage'
import { TimeAgo } from '@/components/TimeAgo'
import { useChatMediaDetailPage } from './useChatMediaDetailPage'
import { isImage, mediaUrl } from './format'
import { MediaFileLink } from './components/MediaFileLink'

export function ChatMediaDetailPage() {
	const { media, isLoading, isDeleting, handleDelete, goBack, goToMessage } =
		useChatMediaDetailPage()

	return (
		<DetailPage
			title="Chat Media"
			onBack={goBack}
			ready={Boolean(media)}
			isLoading={isLoading}
			onDelete={handleDelete}
			deleteTitle="Delete media?"
			deleteDescription="This file will be permanently deleted."
			isDeleting={isDeleting}
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
	)
}
