import { Icon } from '@/components/Icon'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field } from '@/components/Field'
import { SwitchField } from '@/components/SwitchField'
import type { CashOffersEmail } from '@/types/api'
import { useCashOffersEmailDialog } from './useCashOffersEmailDialog'

interface Props {
	groupId: number | null
	email?: CashOffersEmail | null
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function CashOffersEmailDialog({
	groupId,
	email,
	open,
	onOpenChange,
}: Props) {
	const {
		isEdit,
		register,
		errors,
		isActive,
		setIsActive,
		isPending,
		onSubmit,
	} = useCashOffersEmailDialog({
		groupId,
		email,
		onSuccess: () => onOpenChange(false),
	})

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>
						{isEdit ? 'Edit email' : 'Add email'}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={onSubmit} className="space-y-4">
					<Field label="Name" error={errors.name?.message}>
						<Input {...register('name')} />
					</Field>
					<Field label="Email" error={errors.email?.message}>
						<Input type="email" {...register('email')} />
					</Field>
					<SwitchField
						id="cash-offers-email-active"
						label="Active"
						checked={isActive}
						onCheckedChange={setIsActive}
					/>

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
