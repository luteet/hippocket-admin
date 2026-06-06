import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import type { Withdrawal } from '@/types/api'
import {
	useAgentRefOptions,
	useCreateWithdrawal,
	useUpdateWithdrawal,
} from './hooks'

const schema = z.object({
	user_id: z.string().min(1, 'Required'),
	amount: z
		.number({ message: 'Required' })
		.positive('Must be greater than zero'),
	method: z.enum(['paypal', 'venmo', 'cash_app', 'zelle']),
	status: z.enum(['waiting', 'success', 'cancel']),
})

export type WithdrawalFormValues = z.infer<typeof schema>

function defaults(withdrawal?: Withdrawal | null): WithdrawalFormValues {
	return {
		user_id: withdrawal?.user_id ?? '',
		amount: withdrawal?.amount ?? 0,
		method: withdrawal?.method ?? 'paypal',
		status: withdrawal?.status ?? 'waiting',
	}
}

interface Params {
	withdrawal?: Withdrawal | null
	onSuccess: (withdrawal: Withdrawal) => void
}

export function useWithdrawalForm({ withdrawal, onSuccess }: Params) {
	const isEdit = !!withdrawal
	const createMut = useCreateWithdrawal()
	const updateMut = useUpdateWithdrawal()
	const { data: agentOptions, isLoading: isLoadingAgents } =
		useAgentRefOptions()

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		watch,
		formState: { errors },
	} = useForm<WithdrawalFormValues>({
		resolver: zodResolver(schema),
		defaultValues: defaults(withdrawal),
	})

	// The edit page loads the withdrawal asynchronously — sync once it arrives.
	useEffect(() => {
		if (withdrawal) reset(defaults(withdrawal))
	}, [withdrawal, reset])

	const userId = watch('user_id')
	const method = watch('method')
	const status = watch('status')

	const onSubmit = handleSubmit(async (values) => {
		try {
			if (isEdit && withdrawal) {
				const updated = await updateMut.mutateAsync({
					id: withdrawal.id,
					dto: {
						amount: values.amount,
						method: values.method,
						status: values.status,
					},
				})
				toast.success('Withdrawal updated')
				onSuccess(updated)
			} else {
				const created = await createMut.mutateAsync(values)
				toast.success('Withdrawal created')
				onSuccess(created)
			}
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to save'))
		}
	})

	const isPending = createMut.isPending || updateMut.isPending

	return {
		isEdit,
		register,
		errors,
		isPending,
		onSubmit,
		setValue,
		userId,
		method,
		status,
		agentOptions: agentOptions ?? [],
		isLoadingAgents,
	}
}
