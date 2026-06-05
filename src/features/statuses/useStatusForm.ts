import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import type { Status } from '@/types/api'
import { useCreateStatus, useUpdateStatus } from './hooks'

const schema = z.object({
	name: z.string().min(1, 'Required'),
	label: z.string().min(1, 'Required'),
	priority: z
		.number({ message: 'Required' })
		.int('Must be a whole number')
		.min(0, 'Must be zero or greater'),
})

export type StatusFormValues = z.infer<typeof schema>

function defaults(status?: Status | null): StatusFormValues {
	return {
		name: status?.name ?? '',
		label: status?.label ?? '',
		priority: status?.priority ?? 0,
	}
}

interface Params {
	status?: Status | null
	onSuccess: (status: Status) => void
}

export function useStatusForm({ status, onSuccess }: Params) {
	const isEdit = !!status
	const createMut = useCreateStatus()
	const updateMut = useUpdateStatus()

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<StatusFormValues>({
		resolver: zodResolver(schema),
		defaultValues: defaults(status),
	})

	// The edit page loads the status asynchronously — sync the form once it arrives.
	useEffect(() => {
		if (status) reset(defaults(status))
	}, [status, reset])

	const onSubmit = handleSubmit(async (values) => {
		try {
			if (isEdit && status) {
				const updated = await updateMut.mutateAsync({
					id: status.id,
					dto: values,
				})
				toast.success('Status updated')
				onSuccess(updated)
			} else {
				const created = await createMut.mutateAsync(values)
				toast.success('Status created')
				onSuccess(created)
			}
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to save'))
		}
	})

	const isPending = createMut.isPending || updateMut.isPending

	return { register, errors, isPending, onSubmit }
}
