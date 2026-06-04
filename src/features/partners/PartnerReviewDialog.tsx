import { type ReactNode } from 'react'

import { Icon } from '@/components/Icon'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import type { PartnerReview } from '@/types/api'
import { usePartnerReviewDialog } from './usePartnerReviewDialog'

interface Props {
	partnerId: string
	review?: PartnerReview | null
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function PartnerReviewDialog({
	partnerId,
	review,
	open,
	onOpenChange,
}: Props) {
	const { isEdit, register, errors, isPending, onSubmit } =
		usePartnerReviewDialog({
			partnerId,
			review,
			onSuccess: () => onOpenChange(false),
		})

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>
						{isEdit ? 'Edit review' : 'Add review'}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={onSubmit} className="space-y-4">
					<Field label="Name" error={errors.name?.message}>
						<Input {...register('name')} />
					</Field>
					<Field label="Review text" error={errors.text?.message}>
						<Textarea rows={4} {...register('text')} />
					</Field>

					<div className="flex justify-end gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isPending}>
							{isPending && (
								<Icon name="loader" className="animate-spin" />
							)}
							Save
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}

function Field({
	label,
	error,
	children,
}: {
	label: string
	error?: string
	children: ReactNode
}) {
	return (
		<div className="space-y-4">
			<Label>{label}</Label>
			{children}
			{error && <p className="text-xs text-destructive">{error}</p>}
		</div>
	)
}
