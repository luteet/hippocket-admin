import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import type { Group } from '@/types/api'
import { useCreateGroup, useUpdateGroup, useAgentOptions } from './hooks'

export type GroupFormTab = 'general' | 'theme'

const hex = z
	.string()
	.regex(
		/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
		'Use a hex color, e.g. #DF9033',
	)

const schema = z.object({
	name: z.string().min(1, 'Required'),
	// Create-only; ignored on edit. Required when creating.
	slug: z.string().min(1, 'Required'),
	title_logo: z.string().optional(),
	admin_ids: z.array(z.string()),
	color_accent: hex,
	color_primary: hex,
	color_secondary: hex,
	color_secondary_light: hex,
	color_text: hex,
})

export type GroupFormValues = z.infer<typeof schema>

type ColorField =
	| 'color_accent'
	| 'color_primary'
	| 'color_secondary'
	| 'color_secondary_light'
	| 'color_text'

// Which tab each field lives on — used to surface the first error's tab.
const FIELD_TAB: Record<keyof GroupFormValues, GroupFormTab> = {
	name: 'general',
	slug: 'general',
	title_logo: 'general',
	admin_ids: 'general',
	color_accent: 'theme',
	color_primary: 'theme',
	color_secondary: 'theme',
	color_secondary_light: 'theme',
	color_text: 'theme',
}

function defaults(group?: Group | null): GroupFormValues {
	return {
		name: group?.name ?? '',
		slug: group?.slug ?? '',
		title_logo: group?.title_logo ?? '',
		admin_ids: group?.admin_ids ?? [],
		color_accent: group?.color_accent ?? '#DF9033',
		color_primary: group?.color_primary ?? '#F5F5F5',
		color_secondary: group?.color_secondary ?? '#2494AC',
		color_secondary_light: group?.color_secondary_light ?? '#DFF0F4',
		color_text: group?.color_text ?? '#111111',
	}
}

interface Params {
	group?: Group | null
	onSuccess: (group: Group) => void
}

export function useGroupForm({ group, onSuccess }: Params) {
	const isEdit = !!group
	const createMut = useCreateGroup()
	const updateMut = useUpdateGroup()
	const [tab, setTab] = useState<GroupFormTab>('general')

	const form = useForm<GroupFormValues>({
		resolver: zodResolver(schema),
		defaultValues: defaults(group),
	})
	const { handleSubmit, reset, setValue, getValues, watch } = form

	// The edit page loads the group asynchronously — sync the form once it arrives.
	useEffect(() => {
		if (group) reset(defaults(group))
	}, [group, reset])

	const adminIds = watch('admin_ids')
	const colors = {
		color_accent: watch('color_accent'),
		color_primary: watch('color_primary'),
		color_secondary: watch('color_secondary'),
		color_secondary_light: watch('color_secondary_light'),
		color_text: watch('color_text'),
	}

	const { data: agentOptions } = useAgentOptions()

	const toggleAdmin = (id: string) => {
		const current = getValues('admin_ids')
		const next = current.includes(id)
			? current.filter((x) => x !== id)
			: [...current, id]
		setValue('admin_ids', next)
	}

	const setColor = (field: ColorField, value: string) =>
		setValue(field, value, { shouldValidate: true })

	const onSubmit = handleSubmit(
		async (values) => {
			const themeFields = {
				title_logo: values.title_logo ?? '',
				color_accent: values.color_accent,
				color_primary: values.color_primary,
				color_secondary: values.color_secondary,
				color_secondary_light: values.color_secondary_light,
				color_text: values.color_text,
				admin_ids: values.admin_ids,
			}

			try {
				if (isEdit && group) {
					const updated = await updateMut.mutateAsync({
						id: group.id,
						dto: { name: values.name, ...themeFields },
					})
					toast.success('Group updated')
					onSuccess(updated)
				} else {
					const created = await createMut.mutateAsync({
						name: values.name,
						slug: values.slug,
						...themeFields,
					})
					toast.success('Group created')
					onSuccess(created)
				}
			} catch (error) {
				toast.error(getApiErrorMessage(error, 'Failed to save'))
			}
		},
		(formErrors) => {
			// Jump to the tab holding the first invalid field so the error is visible.
			const firstField = Object.keys(formErrors)[0] as
				| keyof GroupFormValues
				| undefined
			if (firstField) setTab(FIELD_TAB[firstField])
		},
	)

	const isPending = createMut.isPending || updateMut.isPending

	return {
		isEdit,
		tab,
		setTab,
		form,
		adminIds,
		colors,
		toggleAdmin,
		setColor,
		agentOptions: agentOptions ?? [],
		isPending,
		onSubmit,
	}
}
