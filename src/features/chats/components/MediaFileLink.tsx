import { fileName, mediaUrl } from '../format'

/** A link that opens a chat media file in a new tab, labelled by its filename. */
export function MediaFileLink({
	file,
	className,
}: {
	file: string
	className?: string
}) {
	return (
		<a
			href={mediaUrl(file)}
			target="_blank"
			rel="noreferrer"
			onClick={(e) => e.stopPropagation()}
			className={
				className ??
				'text-primary underline-offset-2 hover:underline break-all'
			}
		>
			{fileName(file)}
		</a>
	)
}
