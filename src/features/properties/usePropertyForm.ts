import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import type { Property } from '@/types/api'
import { useCreateProperty, useUpdateProperty } from './hooks'

// Optional number: the input clears to null (see `setValueAs` in the form).
const optionalNumber = z.number().nullable()

const schema = z.object({
	address: z.string().min(1, 'Enter an address'),
	city: z.string().min(1, 'Enter a city'),
	state: z.string().min(1, 'Enter a state'),
	zip_code: z.string().min(1, 'Enter a ZIP code'),
	property_type: z.string().min(1, 'Enter a property type'),
	acquisition_agent: z.string().min(1, 'Enter an acquisition agent'),
	contact_person: z.string().min(1, 'Enter a contact person'),
	lead_source: z.string().min(1, 'Enter a lead source'),
	asking_price: z.string().optional(),
	occupied_status: z.string().optional(),
	majors_needed: z.string().optional(),
	status: z.string().optional(),
	description: z.string().optional(),
	beds: optionalNumber,
	baths: optionalNumber,
	garage: optionalNumber,
	sqft: optionalNumber,
	year_built: optionalNumber,
	our_offer: optionalNumber,
	available: z.array(z.string()),
})

export type PropertyFormValues = z.infer<typeof schema>

export const AVAILABLE_OPTIONS: { value: string; label: string }[] = [
	{ value: 'agent', label: 'Agent' },
	{ value: 'buyer', label: 'Buyer' },
]

function defaults(property?: Property | null): PropertyFormValues {
	return {
		address: property?.address ?? '',
		city: property?.city ?? '',
		state: property?.state ?? '',
		zip_code: property?.zip_code ?? '',
		property_type: property?.property_type ?? '',
		acquisition_agent: property?.acquisition_agent ?? '',
		contact_person: property?.contact_person ?? '',
		lead_source: property?.lead_source ?? '',
		asking_price: property?.asking_price ?? '',
		occupied_status: property?.occupied_status ?? '',
		majors_needed: property?.majors_needed ?? '',
		status: property?.status ?? '',
		description: property?.description ?? '',
		beds: property?.beds ?? null,
		baths: property?.baths ?? null,
		garage: property?.garage ?? null,
		sqft: property?.sqft ?? null,
		year_built: property?.year_built ?? null,
		our_offer: property?.our_offer ?? null,
		available: property?.available ?? [],
	}
}

interface Params {
	property?: Property | null
	onSuccess: (property: Property) => void
}

export function usePropertyForm({ property, onSuccess }: Params) {
	const isEdit = !!property
	const createMut = useCreateProperty()
	const updateMut = useUpdateProperty()

	const form = useForm<PropertyFormValues>({
		resolver: zodResolver(schema),
		defaultValues: defaults(property),
	})
	const { handleSubmit, reset, setValue, getValues } = form

	// The edit page loads the property asynchronously — sync the form once it arrives.
	useEffect(() => {
		if (property) reset(defaults(property))
	}, [property, reset])

	const available = form.watch('available')

	const toggleAvailable = (value: string) => {
		const current = getValues('available')
		setValue(
			'available',
			current.includes(value)
				? current.filter((v) => v !== value)
				: [...current, value],
		)
	}

	const onSubmit = handleSubmit(async (values) => {
		// All text/number fields map straight through; the DTO is shared between
		// create and (partial) update.
		const dto = {
			address: values.address,
			city: values.city,
			state: values.state,
			zip_code: values.zip_code,
			property_type: values.property_type,
			acquisition_agent: values.acquisition_agent,
			contact_person: values.contact_person,
			lead_source: values.lead_source,
			asking_price: values.asking_price,
			occupied_status: values.occupied_status,
			majors_needed: values.majors_needed,
			status: values.status,
			description: values.description,
			beds: values.beds,
			baths: values.baths,
			garage: values.garage,
			sqft: values.sqft,
			year_built: values.year_built,
			our_offer: values.our_offer,
			available: values.available,
		}

		try {
			if (isEdit && property) {
				const updated = await updateMut.mutateAsync({
					id: property.id,
					dto,
				})
				toast.success('Property updated')
				onSuccess(updated)
			} else {
				const created = await createMut.mutateAsync(dto)
				toast.success('Property created')
				onSuccess(created)
			}
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to save'))
		}
	})

	return {
		isEdit,
		form,
		available,
		toggleAvailable,
		isPending: createMut.isPending || updateMut.isPending,
		onSubmit,
	}
}
