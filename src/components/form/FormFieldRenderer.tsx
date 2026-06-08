import { Fragment } from 'react'
import { Controller, type UseFormReturn } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Combobox } from '@/components/ui/combobox'
import { Field } from '@/components/Field'
import { SectionTitle } from '@/components/SectionTitle'
import { SwitchField } from '@/components/SwitchField'
import type { FormFieldEntry } from './types'

// The form values are page-specific; the renderer is intentionally untyped here.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyForm = UseFormReturn<any>

function errorMessage(form: AnyForm, name?: string): string | undefined {
	if (!name) return undefined
	return form.formState.errors[name]?.message as string | undefined
}

/**
 * Renders one {@link FormFieldEntry} against a react-hook-form instance. Falsy
 * entries and `hidden` fields render nothing. Used by {@link FormLayout} (which
 * maps the top-level array) and recursively for `grid` fields.
 */
export function FormFieldRenderer({
	field,
	form,
}: {
	field: FormFieldEntry
	form: AnyForm
}) {
	if (!field || field.hidden) return null

	switch (field.type) {
		case 'section':
			return (
				<SectionTitle first={field.first}>{field.title}</SectionTitle>
			)

		case 'switch':
			return (
				<Controller
					control={form.control}
					name={field.name}
					render={({ field: f }) => (
						<SwitchField
							id={field.name}
							label={field.label}
							checked={!!f.value}
							onCheckedChange={f.onChange}
						/>
					)}
				/>
			)

		case 'select':
			return (
				<Field
					label={field.label}
					error={errorMessage(form, field.name)}
				>
					<Controller
						control={form.control}
						name={field.name}
						render={({ field: f }) =>
							field.searchable ? (
								<Combobox
									value={f.value || undefined}
									onValueChange={f.onChange}
									options={field.options}
									placeholder={field.placeholder}
									searchPlaceholder={field.searchPlaceholder}
									disabled={field.disabled}
									onSearch={field.onSearch}
									loading={field.loading}
									selectedLabel={field.selectedLabel}
								/>
							) : (
								<Select
									value={f.value || undefined}
									onValueChange={f.onChange}
									disabled={field.disabled}
								>
									<SelectTrigger>
										<SelectValue
											placeholder={field.placeholder}
										/>
									</SelectTrigger>
									<SelectContent>
										{field.options.map((o) => (
											<SelectItem
												key={o.value}
												value={o.value}
											>
												{o.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)
						}
					/>
				</Field>
			)

		case 'textarea':
			return (
				<Field
					label={field.label}
					error={errorMessage(form, field.name)}
				>
					<Textarea
						rows={field.rows}
						placeholder={field.placeholder}
						disabled={field.disabled}
						{...form.register(field.name, field.registerOptions)}
					/>
				</Field>
			)

		case 'custom':
			return field.label ? (
				<Field
					label={field.label}
					error={errorMessage(form, field.name)}
				>
					{field.render}
				</Field>
			) : (
				<Fragment>{field.render}</Fragment>
			)

		case 'grid':
			return (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					{field.fields.map((f, i) => (
						<FormFieldRenderer key={i} field={f} form={form} />
					))}
				</div>
			)

		default:
			// text | email | url | password | number
			return (
				<Field
					label={field.label}
					error={errorMessage(form, field.name)}
				>
					<Input
						type={field.type}
						step={field.step}
						placeholder={field.placeholder}
						disabled={field.disabled}
						autoComplete={field.autoComplete}
						{...form.register(
							field.name,
							field.registerOptions ??
								(field.type === 'number'
									? { valueAsNumber: true }
									: undefined),
						)}
					/>
				</Field>
			)
	}
}
