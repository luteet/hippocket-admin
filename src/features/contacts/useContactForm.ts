import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import type { Contact } from '@/types/api'
import { useAgentRefOptions, useCreateContact, useUpdateContact } from './hooks'

const schema = z.object({
	first_name: z.string().min(1, 'First name is required'),
	last_name: z.string().optional(),
	// The owning agent — required on create, omitted from the update DTO.
	user_id: z.string().optional(),
	email: z.email('Invalid email'),
	phone: z.string().optional(),
	referral_type: z.string().optional(),
	relation_type: z.string().optional(),
	address: z.string().optional(),
})

export type ContactFormValues = z.infer<typeof schema>

function defaults(contact?: Contact | null): ContactFormValues {
	return {
		first_name: contact?.first_name ?? '',
		last_name: contact?.last_name ?? '',
		user_id: contact?.user_id ?? '',
		email: contact?.email ?? '',
		phone: contact?.phone ?? '',
		referral_type: contact?.referral_type ?? '',
		relation_type: contact?.relation_type ?? '',
		address: contact?.address ?? '',
	}
}

interface Params {
	contact?: Contact | null
	onSuccess: (contact: Contact) => void
}

export function useContactForm({ contact, onSuccess }: Params) {
	const isEdit = !!contact
	const createMut = useCreateContact()
	const updateMut = useUpdateContact()
	const { data: agentRefs, isLoading: agentsLoading } = useAgentRefOptions()

	const form = useForm<ContactFormValues>({
		resolver: zodResolver(schema),
		defaultValues: defaults(contact),
	})
	const { handleSubmit, reset, setError } = form

	// The edit page loads the contact asynchronously — sync once it arrives.
	useEffect(() => {
		if (contact) reset(defaults(contact))
	}, [contact, reset])

	const onSubmit = handleSubmit(async (values) => {
		try {
			if (isEdit && contact) {
				const updated = await updateMut.mutateAsync({
					id: contact.id,
					dto: {
						first_name: values.first_name,
						last_name: values.last_name,
						email: values.email,
						phone: values.phone,
						referral_type: values.referral_type,
						relation_type: values.relation_type,
						address: values.address,
					},
				})
				toast.success('Contact updated')
				onSuccess(updated)
			} else {
				// An owning agent is required on create.
				if (!values.user_id) {
					setError('user_id', { message: 'Select an owner' })
					return
				}
				const created = await createMut.mutateAsync({
					first_name: values.first_name,
					last_name: values.last_name,
					user_id: values.user_id,
					email: values.email,
					phone: values.phone,
					referral_type: values.referral_type,
					relation_type: values.relation_type,
					address: values.address,
				})
				toast.success('Contact created')
				onSuccess(created)
			}
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to save'))
		}
	})

	const isPending = createMut.isPending || updateMut.isPending

	return {
		isEdit,
		form,
		agentRefs: agentRefs ?? [],
		agentsLoading,
		isPending,
		onSubmit,
	}
}
