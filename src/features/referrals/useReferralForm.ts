import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import type { ReferralDetail } from '@/types/api'
import {
	useGroupOptions,
	usePartnerRefs,
	useStatuses,
	useUpdateReferral,
} from './hooks'

export const VALUE_TYPE_OPTIONS = [
	{ value: 'money', label: 'Money' },
	{ value: 'tokens', label: 'Tokens' },
] as const

const amount = z
	.number({ message: 'Enter a number' })
	.min(0, 'Cannot be negative')

const schema = z.object({
	referral_name: z.string().min(1, 'Required'),
	// Selects work with strings; converted to numbers on submit.
	status_id: z.string().min(1, 'Required'),
	referral_group_id: z.string().min(1, 'Required'),
	referral_partner_id: z.string().min(1, 'Required'),
	contact_id: z.string().min(1, 'Required'),
	value_type: z.enum(['money', 'tokens']),
	is_paid: z.boolean(),
	potential_value: z.string().optional(),
	agent_potential_value: amount,
	partner_potential_value: amount,
	coin_course: amount,
})

export type ReferralFormValues = z.infer<typeof schema>

function defaults(referral?: ReferralDetail | null): ReferralFormValues {
	return {
		referral_name: referral?.referral_name ?? '',
		status_id:
			referral?.status_id != null ? String(referral.status_id) : '',
		referral_group_id:
			referral?.group_id != null ? String(referral.group_id) : '',
		referral_partner_id: referral?.partner_id ?? '',
		contact_id: referral?.contact_id ?? '',
		value_type: referral?.value_type ?? 'money',
		is_paid: referral?.is_paid ?? false,
		potential_value: referral?.potential_value ?? '',
		agent_potential_value: referral?.agent_potential_value ?? 0,
		partner_potential_value: referral?.partner_potential_value ?? 0,
		coin_course: referral?.coin_course ?? 0,
	}
}

interface Params {
	referral?: ReferralDetail | null
	onSuccess: (referral: ReferralDetail) => void
}

export function useReferralForm({ referral, onSuccess }: Params) {
	const updateMut = useUpdateReferral()
	const { data: statuses } = useStatuses()
	const { data: partnerOptions } = usePartnerRefs()
	const { data: groupOptions } = useGroupOptions()

	const form = useForm<ReferralFormValues>({
		resolver: zodResolver(schema),
		defaultValues: defaults(referral),
	})
	const { handleSubmit, reset } = form

	// The edit page loads the referral asynchronously — sync once it arrives.
	useEffect(() => {
		if (referral) reset(defaults(referral))
	}, [referral, reset])

	const onSubmit = handleSubmit(async (values) => {
		if (!referral) return
		try {
			const updated = await updateMut.mutateAsync({
				id: referral.id,
				dto: {
					referral_name: values.referral_name,
					status_id: Number(values.status_id),
					is_paid: values.is_paid,
					potential_value: values.potential_value ?? '',
					value_type: values.value_type,
					agent_potential_value: values.agent_potential_value,
					partner_potential_value: values.partner_potential_value,
					coin_course: values.coin_course,
					referral_partner_id: values.referral_partner_id,
					referral_group_id: Number(values.referral_group_id),
					contact_id: values.contact_id,
				},
			})
			toast.success('Referral updated')
			onSuccess(updated)
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to save'))
		}
	})

	return {
		form,
		statusOptions: statuses?.items ?? [],
		partnerOptions: partnerOptions ?? [],
		groupOptions: groupOptions ?? [],
		isPending: updateMut.isPending,
		onSubmit,
	}
}
