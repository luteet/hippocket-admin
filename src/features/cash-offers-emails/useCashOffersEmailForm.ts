import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import type { CashOffersEmail } from '@/types/api'
import {
	useCreateCashOffersEmail,
	useGroupOptions,
	useUpdateCashOffersEmail,
} from './hooks'

// '' = no group (subscribes to all properties).
export const ALL_PROPERTIES = ''

const schema = z.object({
	name: z.string().min(1, 'Enter a name'),
	email: z.email('Invalid email'),
	// Stringified group id; '' means "all properties" (null group).
	group_id: z.string(),
	is_active: z.boolean(),
})

export type CashOffersEmailFormValues = z.infer<typeof schema>

function defaults(email?: CashOffersEmail | null): CashOffersEmailFormValues {
	return {
		name: email?.name ?? '',
		email: email?.email ?? '',
		group_id:
			email?.group_id != null ? String(email.group_id) : ALL_PROPERTIES,
		is_active: email?.is_active ?? true,
	}
}

interface Params {
	email?: CashOffersEmail | null
	onSuccess: (email: CashOffersEmail) => void
}

export function useCashOffersEmailForm({ email, onSuccess }: Params) {
	const isEdit = !!email
	const createMut = useCreateCashOffersEmail()
	const updateMut = useUpdateCashOffersEmail()

	const form = useForm<CashOffersEmailFormValues>({
		resolver: zodResolver(schema),
		defaultValues: defaults(email),
	})
	const { handleSubmit, reset } = form

	useEffect(() => {
		if (email) reset(defaults(email))
	}, [email, reset])

	const { data: groupOptions } = useGroupOptions()

	const onSubmit = handleSubmit(async (values) => {
		const dto = {
			name: values.name,
			email: values.email,
			group_id:
				values.group_id === ALL_PROPERTIES
					? null
					: Number(values.group_id),
			is_active: values.is_active,
		}
		try {
			if (isEdit && email) {
				const updated = await updateMut.mutateAsync({
					id: email.id,
					dto,
				})
				toast.success('Email updated')
				onSuccess(updated)
			} else {
				const created = await createMut.mutateAsync(dto)
				toast.success('Email created')
				onSuccess(created)
			}
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to save'))
		}
	})

	return {
		isEdit,
		form,
		groupOptions: groupOptions ?? [],
		isPending: createMut.isPending || updateMut.isPending,
		onSubmit,
	}
}
