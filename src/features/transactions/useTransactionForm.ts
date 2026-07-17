import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import type { Transaction } from '@/types/api'
import { useCreateTransaction, useUpdateTransaction } from './hooks'

const schema = z.object({
	agent_id: z.string().min(1, 'Select an agent'),
	property_address: z.string().min(1, 'Enter a property address'),
	role: z.enum(['Buyer', 'Seller']),
	customer_name: z.string().min(1, 'Enter a customer name'),
	contract_date: z.string().optional(),
	closing_date: z.string().optional(),
	agent_display_name: z.string().optional(),
})

export type TransactionFormValues = z.infer<typeof schema>

interface Params {
	transaction?: Transaction | null
	onSuccess: (transaction: Transaction) => void
}

export function useTransactionForm({ transaction, onSuccess }: Params) {
	const isEdit = !!transaction
	const createMut = useCreateTransaction()
	const updateMut = useUpdateTransaction()

	const form = useForm<TransactionFormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			agent_id: transaction?.agent_id ?? '',
			property_address: transaction?.property_address ?? '',
			role: transaction?.role ?? 'Buyer',
			customer_name: transaction?.customer_name ?? '',
			contract_date: transaction?.contract_date ?? '',
			closing_date: transaction?.closing_date ?? '',
			agent_display_name: transaction?.agent_display_name ?? '',
		},
	})
	const { handleSubmit, reset } = form

	// Sync the form when the transaction loads (edit mode).
	useEffect(() => {
		if (transaction) {
			reset({
				agent_id: transaction.agent_id,
				property_address: transaction.property_address,
				role: transaction.role,
				customer_name: transaction.customer_name,
				contract_date: transaction.contract_date,
				closing_date: transaction.closing_date,
				agent_display_name: transaction.agent_display_name,
			})
		}
	}, [transaction, reset])

	const onSubmit = handleSubmit(async (values) => {
		try {
			if (isEdit && transaction) {
				const updated = await updateMut.mutateAsync({
					id: transaction.id,
					dto: {
						agent_id: values.agent_id,
						property_address: values.property_address,
						role: values.role,
						customer_name: values.customer_name,
						contract_date: values.contract_date || undefined,
						closing_date: values.closing_date || undefined,
						agent_display_name:
							values.agent_display_name || undefined,
					},
				})
				toast.success('Transaction updated')
				onSuccess(updated)
			} else {
				const created = await createMut.mutateAsync({
					agent_id: values.agent_id,
					property_address: values.property_address,
					role: values.role,
					customer_name: values.customer_name,
					contract_date: values.contract_date || '',
					closing_date: values.closing_date || '',
					agent_display_name: values.agent_display_name || undefined,
					referrals: [],
				})
				toast.success('Transaction created')
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
		isPending,
		onSubmit,
	}
}
