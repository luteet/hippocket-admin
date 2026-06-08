import { useState, type FormEventHandler } from 'react'
import type { UseFormReturn } from 'react-hook-form'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { TabButton } from '@/components/TabButton'
import { FormFieldRenderer } from './FormFieldRenderer'
import type { FormFieldEntry } from './types'

export interface FormTab {
	key: string
	label: string
	fields: FormFieldEntry[]
}

interface FormLayoutProps {
	// The form values are page-specific; kept untyped at the shell boundary.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	form: UseFormReturn<any>
	/** The RHF-wrapped submit handler from the page's `use<Name>Form` hook. */
	onSubmit: FormEventHandler
	onCancel: () => void
	isPending?: boolean
	submitLabel?: string

	/** Single-panel fields. Omit when using `tabs`. */
	fields?: FormFieldEntry[]

	/** Tabbed fields. Both panels stay mounted so values survive tab switches. */
	tabs?: FormTab[]
	activeTab?: string
	onTabChange?: (key: string) => void

	// Delete (edit-only; the layout owns the confirm dialog).
	isEdit?: boolean
	onDelete?: () => void
	isDeleting?: boolean
	deleteTitle?: string
	deleteDescription?: string
}

/**
 * The shared shell for every create/edit form: a `<form>` whose fields are
 * rendered from a declarative array (see {@link FormFieldEntry}), plus the
 * standard Cancel/Save footer (and an optional Delete + confirm dialog for
 * sections without a detail page). Page-specific schema, mutations, and the
 * `onSubmit` handler stay in the `use<Name>Form` hook.
 */
export function FormLayout({
	form,
	onSubmit,
	onCancel,
	isPending,
	submitLabel = 'Save',
	fields,
	tabs,
	activeTab,
	onTabChange,
	isEdit,
	onDelete,
	isDeleting,
	deleteTitle = 'Delete?',
	deleteDescription,
}: FormLayoutProps) {
	const [confirmOpen, setConfirmOpen] = useState(false)
	const canDelete = Boolean(isEdit && onDelete)

	return (
		<form onSubmit={onSubmit} className="space-y-6">
			{tabs ? (
				<>
					<div className="flex gap-1 border-b border-border">
						{tabs.map((t) => (
							<TabButton
								key={t.key}
								active={activeTab === t.key}
								onClick={() => onTabChange?.(t.key)}
							>
								{t.label}
							</TabButton>
						))}
					</div>

					{tabs.map((t) => (
						<div
							key={t.key}
							className={
								activeTab === t.key ? 'space-y-6' : 'hidden'
							}
						>
							{t.fields.map((f, i) => (
								<FormFieldRenderer
									key={i}
									field={f}
									form={form}
								/>
							))}
						</div>
					))}
				</>
			) : (
				fields?.map((f, i) => (
					<FormFieldRenderer key={i} field={f} form={form} />
				))
			)}

			<div className="flex flex-wrap items-center justify-end gap-2 pt-4">
				{canDelete && (
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
					{isPending && (
						<Icon name="loader" className="animate-spin" />
					)}
					{submitLabel}
				</Button>
			</div>

			{isEdit && onDelete && (
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
			)}
		</form>
	)
}
