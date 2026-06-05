import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import type { Partner } from '@/types/api'
import { useReferenceOptions } from '@/features/references/hooks'
import { useCreatePartner, useUpdatePartner } from './hooks'

const fee = z.number({ message: 'Enter a number' }).min(0, 'Cannot be negative')

// Optional amount: the input clears to null (see `setValueAs` in the form).
const optionalAmount = z.number().min(0, 'Cannot be negative').nullable()

const schema = z.object({
	name: z.string().min(1, 'Enter a name'),
	email: z.string().email('Invalid email'),
	phone: z.string().optional(),
	subtitle: z.string().optional(),
	short_description: z.string().optional(),
	description: z.string().optional(),
	website: z.string().optional(),
	address: z.string().optional(),
	custom_keywords: z.string().optional(),
	agent_fee: fee,
	group_owner_fee: fee,
	hippocket_fee: fee,
	potential_value: optionalAmount,
	value_type: z.enum(['money', 'tokens']),
	is_hide: z.boolean(),
	is_hide_for_journey: z.boolean(),
	sms_notifications_enabled: z.boolean(),
	sms_phone: z.string().optional(),
	location_id: z.string().optional(),
	category_id: z.string().optional(),
	service_id: z.string().optional(),
})

export type PartnerFormValues = z.infer<typeof schema>

interface Params {
	partner?: Partner | null
	onSuccess: (partner: Partner) => void
}

export function usePartnerForm({ partner, onSuccess }: Params) {
	const isEdit = !!partner
	const createMut = useCreatePartner()
	const updateMut = useUpdatePartner()

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		watch,
		formState: { errors },
	} = useForm<PartnerFormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: partner?.name ?? '',
			email: partner?.email ?? '',
			phone: partner?.phone ?? '',
			subtitle: partner?.subtitle ?? '',
			short_description: partner?.short_description ?? '',
			description: partner?.description ?? '',
			website: partner?.website ?? '',
			address: partner?.address ?? '',
			custom_keywords: partner?.custom_keywords ?? '',
			agent_fee: partner?.agent_fee ?? 0,
			group_owner_fee: partner?.group_owner_fee ?? 0,
			hippocket_fee: partner?.hippocket_fee ?? 0,
			potential_value: partner?.potential_value ?? null,
			value_type: partner?.value_type ?? 'money',
			is_hide: partner?.is_hide ?? false,
			is_hide_for_journey: partner?.is_hide_for_journey ?? false,
			sms_notifications_enabled:
				partner?.sms_notifications_enabled ?? false,
			sms_phone: partner?.sms_phone ?? '',
			location_id: partner?.location_id ?? '',
			category_id: partner?.category_id ?? '',
			service_id: partner?.service_id ?? '',
		},
	})

	// The edit page loads the partner asynchronously — sync the form once it arrives.
	useEffect(() => {
		if (partner) {
			reset({
				name: partner.name,
				email: partner.email,
				phone: partner.phone,
				subtitle: partner.subtitle,
				short_description: partner.short_description,
				description: partner.description,
				website: partner.website,
				address: partner.address,
				custom_keywords: partner.custom_keywords,
				agent_fee: partner.agent_fee,
				group_owner_fee: partner.group_owner_fee,
				hippocket_fee: partner.hippocket_fee,
				potential_value: partner.potential_value,
				value_type: partner.value_type,
				is_hide: partner.is_hide,
				is_hide_for_journey: partner.is_hide_for_journey,
				sms_notifications_enabled: partner.sms_notifications_enabled,
				sms_phone: partner.sms_phone,
				location_id: partner.location_id ?? '',
				category_id: partner.category_id ?? '',
				service_id: partner.service_id ?? '',
			})
		}
	}, [partner, reset])

	const valueType = watch('value_type')
	const isHide = watch('is_hide')
	const isHideForJourney = watch('is_hide_for_journey')
	const smsEnabled = watch('sms_notifications_enabled')
	const locationId = watch('location_id')
	const categoryId = watch('category_id')
	const serviceId = watch('service_id')

	// Option lists for the location/category/service selects (shown in both
	// create and edit mode).
	const { data: locationOptions } = useReferenceOptions(
		'partner-locations',
		'/refs/partner-locations/',
	)
	const { data: categoryOptions } = useReferenceOptions(
		'partner-categories',
		'/refs/partner-categories/',
	)
	const { data: serviceOptions } = useReferenceOptions(
		'partner-services',
		'/refs/partner-services/',
	)

	const onSubmit = handleSubmit(async (values) => {
		try {
			if (isEdit && partner) {
				const updated = await updateMut.mutateAsync({
					id: partner.id,
					dto: {
						name: values.name,
						email: values.email,
						phone: values.phone,
						subtitle: values.subtitle,
						short_description: values.short_description,
						description: values.description,
						website: values.website,
						address: values.address,
						custom_keywords: values.custom_keywords,
						agent_fee: values.agent_fee,
						group_owner_fee: values.group_owner_fee,
						hippocket_fee: values.hippocket_fee,
						potential_value: values.potential_value,
						is_hide: values.is_hide,
						is_hide_for_journey: values.is_hide_for_journey,
						sms_notifications_enabled:
							values.sms_notifications_enabled,
						sms_phone: values.sms_phone,
						location_id: values.location_id || null,
						category_id: values.category_id || null,
						service_id: values.service_id || null,
					},
				})
				toast.success('Partner updated')
				onSuccess(updated)
			} else {
				const created = await createMut.mutateAsync({
					name: values.name,
					email: values.email,
					phone: values.phone,
					subtitle: values.subtitle,
					short_description: values.short_description,
					description: values.description,
					website: values.website,
					address: values.address,
					custom_keywords: values.custom_keywords,
					agent_fee: values.agent_fee,
					group_owner_fee: values.group_owner_fee,
					hippocket_fee: values.hippocket_fee,
					potential_value: values.potential_value,
					value_type: values.value_type,
					is_hide_for_journey: values.is_hide_for_journey,
					sms_notifications_enabled: values.sms_notifications_enabled,
					sms_phone: values.sms_phone,
					location_id: values.location_id || null,
					category_id: values.category_id || null,
					service_id: values.service_id || null,
				})
				toast.success('Partner created')
				onSuccess(created)
			}
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to save'))
		}
	})

	const isPending = createMut.isPending || updateMut.isPending

	// Creating new reference options isn't supported by the API yet.
	const handleCreateRef = () => {
		toast.info('Creating new options is under development')
	}

	return {
		isEdit,
		register,
		errors,
		setValue,
		handleCreateRef,
		valueType,
		isHide,
		isHideForJourney,
		smsEnabled,
		locationId,
		categoryId,
		serviceId,
		locationOptions: locationOptions ?? [],
		categoryOptions: categoryOptions ?? [],
		serviceOptions: serviceOptions ?? [],
		isPending,
		onSubmit,
	}
}
