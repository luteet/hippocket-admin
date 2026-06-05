import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import type { Agent } from '@/types/api'
import { useCreateAgent, useGroupOptions, useUpdateAgent } from './hooks'

const amount = z
	.number({ message: 'Enter a number' })
	.min(0, 'Cannot be negative')

const schema = z.object({
	email: z.string().email('Invalid email'),
	// New email requested on edit — applied once the agent confirms it. Empty
	// means "no change".
	pending_email: z
		.string()
		.email('Invalid email')
		.or(z.literal(''))
		.optional(),
	// Required on create, optional on edit — enforced in onSubmit since the rule
	// depends on the mode.
	password: z.string().optional(),
	username: z.string().optional(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	phone: z.string().optional(),
	company: z.string().optional(),
	address: z.string().optional(),
	role: z.enum(['source', 'partner', 'buyer']),
	status: z.enum(['agent', 'apartment', 'real', 'service', 'referral']),
	// The agent's group memberships.
	group_ids: z.array(z.number()),
	// The primary group — must be one of `group_ids`. The select works with
	// strings; '' means "none".
	chosen_group_id: z.string().optional(),
	balance: amount,
	balance_coin: amount,
	paypal_data: z.string().optional(),
	venmo_id: z.string().optional(),
	cash_app_info: z.string().optional(),
	zelle: z.string().optional(),
	license_number: z.string().optional(),
	is_active: z.boolean(),
	is_new_user: z.boolean(),
	is_hide: z.boolean(),
	default_admin: z.boolean(),
})

export type AgentFormValues = z.infer<typeof schema>

const MIN_PASSWORD = 6

function defaults(agent?: Agent | null): AgentFormValues {
	return {
		email: agent?.email ?? '',
		pending_email: agent?.pending_email ?? '',
		password: '',
		username: agent?.username ?? '',
		first_name: agent?.first_name ?? '',
		last_name: agent?.last_name ?? '',
		phone: agent?.phone ?? '',
		company: agent?.company ?? '',
		address: agent?.address ?? '',
		role: agent?.role ?? 'source',
		status: agent?.status ?? 'agent',
		group_ids: agent?.group_ids ?? [],
		chosen_group_id:
			agent?.chosen_group_id != null ? String(agent.chosen_group_id) : '',
		balance: agent?.balance ?? 0,
		balance_coin: agent?.balance_coin ?? 0,
		paypal_data: agent?.paypal_data ?? '',
		venmo_id: agent?.venmo_id ?? '',
		cash_app_info: agent?.cash_app_info ?? '',
		zelle: agent?.zelle ?? '',
		license_number: agent?.license_number ?? '',
		is_active: agent?.is_active ?? true,
		is_new_user: agent?.is_new_user ?? true,
		is_hide: agent?.is_hide ?? false,
		default_admin: agent?.default_admin ?? false,
	}
}

interface Params {
	agent?: Agent | null
	onSuccess: (agent: Agent) => void
}

export function useAgentForm({ agent, onSuccess }: Params) {
	const isEdit = !!agent
	const createMut = useCreateAgent()
	const updateMut = useUpdateAgent()

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		setError,
		getValues,
		watch,
		formState: { errors },
	} = useForm<AgentFormValues>({
		resolver: zodResolver(schema),
		defaultValues: defaults(agent),
	})

	// The edit page loads the agent asynchronously — sync the form once it arrives.
	useEffect(() => {
		if (agent) reset(defaults(agent))
	}, [agent, reset])

	const role = watch('role')
	const status = watch('status')
	const groupIds = watch('group_ids')
	const chosenGroupId = watch('chosen_group_id')
	const isActive = watch('is_active')
	const isNewUser = watch('is_new_user')
	const isHide = watch('is_hide')
	const defaultAdmin = watch('default_admin')

	const { data: groupOptions } = useGroupOptions()

	/** Add/remove a group from the memberships; clears the chosen group if it
	 * was the one removed (the primary must stay a member). */
	const toggleGroup = (id: number) => {
		const current = getValues('group_ids')
		const next = current.includes(id)
			? current.filter((x) => x !== id)
			: [...current, id]
		setValue('group_ids', next)
		const chosen = getValues('chosen_group_id')
		if (chosen && !next.includes(Number(chosen))) {
			setValue('chosen_group_id', '')
		}
	}

	const setChosenGroup = (value: string) => setValue('chosen_group_id', value)

	const onSubmit = handleSubmit(async (values) => {
		// Password is required when creating.
		if (!isEdit && (values.password ?? '').length < MIN_PASSWORD) {
			setError('password', {
				message: `At least ${MIN_PASSWORD} characters`,
			})
			return
		}

		const groupId =
			values.chosen_group_id && values.chosen_group_id !== ''
				? Number(values.chosen_group_id)
				: null

		try {
			if (isEdit && agent) {
				const updated = await updateMut.mutateAsync({
					id: agent.id,
					dto: {
						username: values.username,
						first_name: values.first_name,
						last_name: values.last_name,
						phone: values.phone,
						company: values.company,
						address: values.address,
						role: values.role,
						status: values.status,
						is_active: values.is_active,
						is_new_user: values.is_new_user,
						balance: values.balance,
						balance_coin: values.balance_coin,
						chosen_group_id: groupId,
						group_ids: values.group_ids,
						// New email goes through the pending-email flow; null
						// clears any outstanding request.
						pending_email: values.pending_email || null,
						paypal_data: values.paypal_data,
						venmo_id: values.venmo_id,
						cash_app_info: values.cash_app_info,
						zelle: values.zelle,
						license_number: values.license_number,
						// Only send a password when one was entered.
						...(values.password
							? { password: values.password }
							: {}),
					},
				})
				toast.success('Agent updated')
				onSuccess(updated)
			} else {
				const created = await createMut.mutateAsync({
					email: values.email,
					password: values.password as string,
					username: values.username,
					first_name: values.first_name,
					last_name: values.last_name,
					phone: values.phone,
					company: values.company,
					address: values.address,
					role: values.role,
					status: values.status,
					is_active: values.is_active,
					is_hide: values.is_hide,
					is_new_user: values.is_new_user,
					default_admin: values.default_admin,
					balance: values.balance,
					balance_coin: values.balance_coin,
					chosen_group_id: groupId,
					group_ids: values.group_ids,
					paypal_data: values.paypal_data,
					venmo_id: values.venmo_id,
					cash_app_info: values.cash_app_info,
					zelle: values.zelle,
					license_number: values.license_number,
					referral_code: null,
				})
				toast.success('Agent created')
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
		setValue,
		role,
		status,
		groupIds,
		chosenGroupId,
		toggleGroup,
		setChosenGroup,
		isActive,
		isNewUser,
		isHide,
		defaultAdmin,
		groupOptions: groupOptions ?? [],
		isPending,
		onSubmit,
	}
}
