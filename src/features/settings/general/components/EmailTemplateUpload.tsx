import { DocumentUpload } from '@/components/media/DocumentUpload'
import {
	useUploadEmailTemplate,
	useUploadEmailWithdrawTemplate,
} from '../../hooks'

interface Props {
	/** Current template file URL, or null when none is uploaded. */
	url: string | null
	/** Which template endpoint this field drives. */
	kind: 'partner' | 'withdraw'
}

/** Settings wiring of the shared {@link DocumentUpload} to the two
 *  `PUT /settings/email-*-template/` HTML-file endpoints. */
export function EmailTemplateUpload({ url, kind }: Props) {
	const partnerMut = useUploadEmailTemplate()
	const withdrawMut = useUploadEmailWithdrawTemplate()
	const mut = kind === 'partner' ? partnerMut : withdrawMut

	return (
		<DocumentUpload
			url={url}
			accept="text/html,.html,.htm"
			uploadLabel="Upload template"
			changeLabel="Replace template"
			successMessage="Template updated"
			errorFallback="Failed to upload template"
			onUpload={async (file) => {
				const updated = await mut.mutateAsync(file)
				return kind === 'partner'
					? (updated.email_template ?? null)
					: (updated.email_withdraw_template ?? null)
			}}
		/>
	)
}
