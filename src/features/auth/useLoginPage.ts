import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import { useAuth } from './AuthContext'

const loginSchema = z.object({
	username: z.string().min(1, 'Enter your username'),
	password: z.string().min(1, 'Enter your password'),
})

type LoginForm = z.infer<typeof loginSchema>

interface LocationState {
	from?: { pathname: string }
}

export function useLoginPage() {
	const { login, isAuthenticated } = useAuth()
	const navigate = useNavigate()
	const location = useLocation()
	const from = (location.state as LocationState | null)?.from?.pathname ?? '/'

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
		defaultValues: { username: '', password: '' },
	})

	useEffect(() => {
		if (isAuthenticated) navigate(from, { replace: true })
	}, [isAuthenticated, from, navigate])

	const onSubmit = handleSubmit(async (values) => {
		try {
			await login(values.username, values.password)
			navigate(from, { replace: true })
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to sign in'))
		}
	})

	return { register, errors, isSubmitting, onSubmit }
}
