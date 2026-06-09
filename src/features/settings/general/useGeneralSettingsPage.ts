import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import type { AdminSettings } from '@/types/api'
import { useSettings, useUpdateSettings } from '../hooks'

const schema = z.object({
	// ";"-separated recipient addresses; free text so the admin can manage the
	// whole list in one field.
	admin_email: z.string(),
	ai_system_prompt: z.string(),
})

export type GeneralSettingsValues = z.infer<typeof schema>

function defaults(settings?: AdminSettings): GeneralSettingsValues {
	return {
		admin_email: settings?.admin_email ?? '',
		ai_system_prompt: settings?.ai_system_prompt ?? '',
	}
}

export function useGeneralSettingsPage() {
	const { data: settings, isLoading } = useSettings()
	const updateMut = useUpdateSettings()

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<GeneralSettingsValues>({
		resolver: zodResolver(schema),
		defaultValues: defaults(settings),
	})

	// The singleton loads asynchronously — sync the form once it arrives.
	useEffect(() => {
		if (settings) reset(defaults(settings))
	}, [settings, reset])

	const onSubmit = handleSubmit(async (values) => {
		try {
			await updateMut.mutateAsync(values)
			toast.success('Settings saved')
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to save'))
		}
	})

	return {
		settings,
		isLoading,
		register,
		errors,
		isPending: updateMut.isPending,
		onSubmit,
	}
}
