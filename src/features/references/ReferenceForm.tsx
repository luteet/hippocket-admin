import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field } from '@/components/Field'
import type { CatalogRecord } from '@/types/api'
import { useReferenceForm } from './useReferenceForm'
import type { ReferenceKind } from './useReferenceListPage'

interface Props {
	kind: ReferenceKind
	item?: CatalogRecord | null
	onSuccess: (item: CatalogRecord) => void
	onCancel: () => void
}

export function ReferenceForm({ kind, item, onSuccess, onCancel }: Props) {
	const { config, register, errors, isPending, onSubmit } = useReferenceForm({
		kind,
		item,
		onSuccess,
	})

	return (
		<form onSubmit={onSubmit} className="space-y-6">
			<Field label="Name" error={errors.name?.message}>
				<Input placeholder={config.singular} {...register('name')} />
			</Field>

			{config.hasContent && (
				<>
					<Field
						label="Description"
						error={errors.description?.message}
					>
						<Textarea
							placeholder="What this category covers…"
							{...register('description')}
						/>
					</Field>
					<Field label="Keywords" error={errors.keywords?.message}>
						<Textarea
							placeholder="comma, separated, keywords"
							{...register('keywords')}
						/>
					</Field>
				</>
			)}

			<Field label="Sort" error={errors.sort?.message}>
				<Input
					type="number"
					placeholder="0"
					{...register('sort', { valueAsNumber: true })}
				/>
			</Field>

			<div className="flex justify-end gap-2 pt-4">
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
					{isPending && (
						<Icon name="loader" className="animate-spin" />
					)}
					Save
				</Button>
			</div>
		</form>
	)
}
