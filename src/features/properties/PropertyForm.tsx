import { FormLayout } from '@/components/form/FormLayout'
import type { FormFieldEntry } from '@/components/form/types'
import type { Property } from '@/types/api'
import { AvailableSelect } from './components/AvailableSelect'
import { MainImageUpload } from './components/MainImageUpload'
import { PriceInput } from './components/PriceInput'
import { AVAILABLE_OPTIONS, usePropertyForm } from './usePropertyForm'

interface Props {
	property?: Property | null
	onSuccess: (property: Property) => void
	onCancel: () => void
}

// Clears an empty numeric input to null instead of NaN (zod expects number|null).
const nullableNumber = {
	setValueAs: (v: unknown) => (v === '' || v == null ? null : Number(v)),
}

export function PropertyForm({ property, onSuccess, onCancel }: Props) {
	const { isEdit, form, available, toggleAvailable, isPending, onSubmit } =
		usePropertyForm({ property, onSuccess })

	const fields: FormFieldEntry[] = [
		{ type: 'section', title: 'Address', first: true },
		{ type: 'text', name: 'address', label: 'Address' },
		{
			type: 'grid',
			fields: [
				{ type: 'text', name: 'city', label: 'City' },
				{ type: 'text', name: 'state', label: 'State' },
			],
		},
		{
			type: 'grid',
			fields: [
				{ type: 'text', name: 'zip_code', label: 'ZIP code' },
				{
					type: 'text',
					name: 'property_type',
					label: 'Property type',
					placeholder: 'e.g. Single Family',
				},
			],
		},

		// The main photo is uploaded via a standalone endpoint that needs an
		// existing property, so it only appears on edit.
		isEdit && property && { type: 'section', title: 'Photo' },
		isEdit &&
			property && {
				type: 'custom',
				label: 'Main photo',
				render: (
					<MainImageUpload
						propertyId={property.id}
						imageUrl={property.image}
					/>
				),
			},

		{ type: 'section', title: 'Details' },
		{
			type: 'grid',
			fields: [
				{
					type: 'number',
					name: 'beds',
					label: 'Beds',
					registerOptions: nullableNumber,
				},
				{
					type: 'number',
					name: 'baths',
					label: 'Baths',
					step: '0.5',
					registerOptions: nullableNumber,
				},
				{
					type: 'number',
					name: 'garage',
					label: 'Garage',
					registerOptions: nullableNumber,
				},
				{
					type: 'number',
					name: 'sqft',
					label: 'Sqft',
					registerOptions: nullableNumber,
				},
				{
					type: 'number',
					name: 'year_built',
					label: 'Year built',
					registerOptions: nullableNumber,
				},
			],
		},
		{
			type: 'grid',
			fields: [
				{
					type: 'text',
					name: 'occupied_status',
					label: 'Occupied status',
					placeholder: 'e.g. Occupied',
				},
				{
					type: 'text',
					name: 'majors_needed',
					label: 'Majors needed',
				},
			],
		},
		{
			type: 'custom',
			label: 'Available to',
			render: (
				<AvailableSelect
					options={AVAILABLE_OPTIONS}
					selected={available}
					onToggle={toggleAvailable}
				/>
			),
		},
		{
			type: 'textarea',
			name: 'description',
			label: 'Description',
			rows: 3,
		},

		{ type: 'section', title: 'Pricing' },
		{
			type: 'grid',
			fields: [
				{
					type: 'custom',
					name: 'asking_price',
					label: 'Asking price',
					render: (
						<PriceInput
							control={form.control}
							name="asking_price"
							placeholder="e.g. $350,000"
						/>
					),
				},
				{
					type: 'number',
					name: 'our_offer',
					label: 'Our offer ($)',
					registerOptions: nullableNumber,
				},
			],
		},
		{ type: 'text', name: 'status', label: 'Status' },

		{ type: 'section', title: 'Acquisition' },
		{
			type: 'grid',
			fields: [
				{
					type: 'text',
					name: 'acquisition_agent',
					label: 'Acquisition agent',
				},
				{
					type: 'text',
					name: 'contact_person',
					label: 'Contact person',
				},
			],
		},
		{ type: 'text', name: 'lead_source', label: 'Lead source' },
	]

	return (
		<FormLayout
			form={form}
			fields={fields}
			onSubmit={onSubmit}
			onCancel={onCancel}
			isPending={isPending}
		/>
	)
}
