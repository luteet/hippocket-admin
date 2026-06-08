import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import type { SharedPartnerEntry } from '@/types/api'
import {
	useAddSharedPartnerEntry,
	usePartnerRefOptions,
	useUpdateSharedPartnerEntry,
} from './hooks'

const schema = z.object({
	partner_id: z.string().min(1, 'Select a partner'),
	is_top_rated: z.boolean(),
	is_recommend: z.boolean(),
})

export type SharedPartnerEntryFormValues = z.infer<typeof schema>

function defaults(
	entry?: SharedPartnerEntry | null,
): SharedPartnerEntryFormValues {
	return {
		partner_id: entry?.partner_id ?? '',
		is_top_rated: entry?.is_top_rated ?? false,
		is_recommend: entry?.is_recommend ?? false,
	}
}

interface Params {
	sharedId: string
	entry?: SharedPartnerEntry | null
	onSuccess: () => void
}

export function useSharedPartnerEntryDialog({
	sharedId,
	entry,
	onSuccess,
}: Params) {
	const isEdit = !!entry
	const addMut = useAddSharedPartnerEntry(sharedId)
	const updateMut = useUpdateSharedPartnerEntry(sharedId)
	const { data: partnerRefs, isLoading: partnersLoading } =
		usePartnerRefOptions()

	const {
		register,
		handleSubmit,
		reset,
		watch,
		setValue,
		formState: { errors },
	} = useForm<SharedPartnerEntryFormValues>({
		resolver: zodResolver(schema),
		defaultValues: defaults(entry),
	})

	// Sync the form when the target entry changes (open / switch row).
	useEffect(() => {
		reset(defaults(entry))
	}, [entry, reset])

	const onSubmit = handleSubmit(async (values) => {
		try {
			if (isEdit && entry) {
				// The pinned partner is fixed; only the flags are editable.
				await updateMut.mutateAsync({
					entryId: entry.id,
					dto: {
						is_top_rated: values.is_top_rated,
						is_recommend: values.is_recommend,
					},
				})
				toast.success('Entry updated')
			} else {
				await addMut.mutateAsync(values)
				toast.success('Partner added')
			}
			onSuccess()
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to save entry'))
		}
	})

	return {
		isEdit,
		partnerName: entry?.partner_name ?? '',
		partnerOptions: partnerRefs ?? [],
		partnersLoading,
		register,
		errors,
		partnerId: watch('partner_id'),
		isTopRated: watch('is_top_rated'),
		isRecommend: watch('is_recommend'),
		setPartnerId: (v: string) => setValue('partner_id', v),
		setTopRated: (v: boolean) => setValue('is_top_rated', v),
		setRecommend: (v: boolean) => setValue('is_recommend', v),
		isPending: addMut.isPending || updateMut.isPending,
		onSubmit,
	}
}
