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

export function useLoginPage() {
	const { login } = useAuth()

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
		defaultValues: { username: '', password: '' },
	})

	// Signing in flips isAuthenticated, which makes Pages swap the login screen
	// for the admin shell in place — no navigation needed.
	const onSubmit = handleSubmit(async (values) => {
		try {
			await login(values.username, values.password)
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to sign in'))
		}
	})

	return { register, errors, isSubmitting, onSubmit }
}
