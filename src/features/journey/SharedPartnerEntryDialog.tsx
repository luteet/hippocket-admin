import { Icon } from '@/components/Icon'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/Field'
import { SwitchField } from '@/components/SwitchField'
import type { SharedPartnerEntry } from '@/types/api'
import { PartnerSelect } from './components/PartnerSelect'
import { useSharedPartnerEntryDialog } from './useSharedPartnerEntryDialog'

interface Props {
	sharedId: string
	entry?: SharedPartnerEntry | null
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function SharedPartnerEntryDialog({
	sharedId,
	entry,
	open,
	onOpenChange,
}: Props) {
	const {
		isEdit,
		partnerName,
		partnerOptions,
		partnersLoading,
		errors,
		partnerId,
		isTopRated,
		isRecommend,
		setPartnerId,
		setTopRated,
		setRecommend,
		isPending,
		onSubmit,
	} = useSharedPartnerEntryDialog({
		sharedId,
		entry,
		onSuccess: () => onOpenChange(false),
	})

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>
						{isEdit ? 'Edit entry' : 'Add partner'}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={onSubmit} className="space-y-4">
					<Field label="Partner" error={errors.partner_id?.message}>
						{isEdit ? (
							// The pinned partner can't change once added.
							<p className="rounded-md border border-border px-3 py-2 text-sm">
								{partnerName}
							</p>
						) : (
							<PartnerSelect
								value={partnerId}
								options={partnerOptions}
								loading={partnersLoading}
								onChange={setPartnerId}
							/>
						)}
					</Field>

					<SwitchField
						id="is_top_rated"
						label="Top rated"
						checked={isTopRated}
						onCheckedChange={setTopRated}
					/>
					<SwitchField
						id="is_recommend"
						label="Recommended"
						checked={isRecommend}
						onCheckedChange={setRecommend}
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
