import { MediaUpload } from '@/components/media/MediaUpload'
import { useUploadAgentAvatar } from '../hooks'

interface Props {
	agentId: string
	avatarUrl: string | null
}

/** Agent-specific wiring of the shared {@link MediaUpload} to
 *  `PUT /agents/{id}/avatar/`. */
export function AvatarUpload({ agentId, avatarUrl }: Props) {
	const uploadMut = useUploadAgentAvatar()

	return (
		<MediaUpload
			url={avatarUrl}
			shape="circle"
			placeholderIcon="user"
			accept="image/png,image/jpeg,image/webp"
			maxSize={5 * 1024 * 1024}
			uploadLabel="Upload avatar"
			changeLabel="Change avatar"
			successMessage="Avatar updated"
			errorFallback="Failed to upload avatar"
			onUpload={async (file) => {
				const updated = await uploadMut.mutateAsync({
					id: agentId,
					file,
				})
				return updated.avatar_url
			}}
		/>
	)
}
