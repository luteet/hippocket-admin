import type { ReactNode } from 'react'
import type { RegisterOptions } from 'react-hook-form'

export type FormFieldOption = { value: string; label: string }

interface FieldCommon {
	/** Skip rendering this field (e.g. an edit-only flag on the create form). */
	hidden?: boolean
}

/** A text-like control backed by `register`. `number` defaults to
 *  `valueAsNumber`; override coercion via `registerOptions`. */
export interface InputFormField extends FieldCommon {
	type: 'text' | 'email' | 'url' | 'password' | 'number'
	name: string
	label: string
	placeholder?: string
	disabled?: boolean
	step?: string
	autoComplete?: string
	registerOptions?: RegisterOptions
}

export interface TextareaFormField extends FieldCommon {
	type: 'textarea'
	name: string
	label: string
	placeholder?: string
	disabled?: boolean
	rows?: number
	registerOptions?: RegisterOptions
}

/** A shadcn `<Select>` driven by a `Controller`. Set `searchable` for long
 *  option lists to render a filterable `<Combobox>` instead. */
export interface SelectFormField extends FieldCommon {
	type: 'select'
	name: string
	label: string
	options: FormFieldOption[]
	placeholder?: string
	disabled?: boolean
	searchable?: boolean
	/** Combobox-only: placeholder for the search input. */
	searchPlaceholder?: string
	/** Combobox-only: search server-side. Receives the (debounced) query;
	 *  `options` then hold the already-filtered results. */
	onSearch?: (query: string) => void
	/** Combobox-only: server-search results are loading. */
	loading?: boolean
	/** Combobox-only: label for the current value when it isn't in `options`
	 *  (e.g. a saved selection not yet returned by the server search). */
	selectedLabel?: string
}

export interface SwitchFormField extends FieldCommon {
	type: 'switch'
	name: string
	label: string
}

/** A `<SectionTitle>` separating groups of fields (not an input). Pass `first`
 *  for the leading section (no top separator/padding). */
export interface SectionFormField extends FieldCommon {
	type: 'section'
	title: string
	first?: boolean
}

/** An escape hatch for bespoke controls (RefSelect, ColorField, multi-selects,
 *  readonly-on-edit displays). Pass `label` to wrap the node in a `<Field>`. */
export interface CustomFormField extends FieldCommon {
	type: 'custom'
	label?: string
	name?: string
	render: ReactNode
}

/** A responsive 2-column grid of nested fields. */
export interface GridFormField extends FieldCommon {
	type: 'grid'
	fields: FormFieldEntry[]
}

export type FormField =
	| InputFormField
	| TextareaFormField
	| SelectFormField
	| SwitchFormField
	| SectionFormField
	| CustomFormField
	| GridFormField

/** Entries may be falsy so callers can inline conditionals
 *  (`isEdit && { … }`). */
export type FormFieldEntry = FormField | false | null | undefined
