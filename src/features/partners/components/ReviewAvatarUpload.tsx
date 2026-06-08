import { MediaUpload } from '@/components/media/MediaUpload'
import { useUploadPartnerReviewAvatar } from '../hooks'

interface Props {
	partnerId: string
	reviewId: string
	avatarUrl: string | null
}

/** Partner-review-specific wiring of the shared {@link MediaUpload} to
 *  `PUT /partners/{id}/reviews/{reviewId}/avatar/`. */
export function ReviewAvatarUpload({ partnerId, reviewId, avatarUrl }: Props) {
	const uploadMut = useUploadPartnerReviewAvatar(partnerId)

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
				const updated = await uploadMut.mutateAsync({ reviewId, file })
				return updated.avatar_url
			}}
		/>
	)
}
