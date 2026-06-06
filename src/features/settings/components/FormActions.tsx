import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ConfirmDialog'

// The shared footer for every settings create/edit form: Save/Cancel on the
// right, plus a Delete button + confirmation when editing (these sections have
// no detail page, so delete lives here).
interface Props {
	isEdit: boolean
	isPending: boolean
	isDeleting: boolean
	confirmOpen: boolean
	setConfirmOpen: (open: boolean) => void
	onDelete: () => void
	onCancel: () => void
	deleteTitle: string
	deleteDescription?: string
}

export function FormActions({
	isEdit,
	isPending,
	isDeleting,
	confirmOpen,
	setConfirmOpen,
	onDelete,
	onCancel,
	deleteTitle,
	deleteDescription,
}: Props) {
	return (
		<div className="flex flex-wrap items-center justify-end gap-2 pt-4">
			{isEdit && (
				<Button
					type="button"
					variant="destructive"
					className="mr-auto"
					onClick={() => setConfirmOpen(true)}
				>
					<Icon name="trash-2" />
					Delete
				</Button>
			)}
			<Button
				type="button"
				variant="outline"
				className="flex-auto xs:min-w-32 xs:flex-none"
				onClick={onCancel}
			>
				Cancel
			</Button>
			<Button
				type="submit"
				disabled={isPending}
				className="flex-auto xs:min-w-32 xs:flex-none"
			>
				{isPending && <Icon name="loader" className="animate-spin" />}
				Save
			</Button>

			<ConfirmDialog
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				title={deleteTitle}
				description={deleteDescription}
				confirmLabel="Delete"
				destructive
				loading={isDeleting}
				onConfirm={onDelete}
			/>
		</div>
	)
}
