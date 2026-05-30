import * as React from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'motion/react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
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

export function LoginPage() {
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

	React.useEffect(() => {
		if (isAuthenticated) navigate(from, { replace: true })
	}, [isAuthenticated, from, navigate])

	const onSubmit = async (values: LoginForm) => {
		try {
			await login(values.username, values.password)
			navigate(from, { replace: true })
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to sign in'))
		}
	}

	return (
		<div className="flex min-h-dvh items-center justify-center bg-background p-4">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3 }}
				className="w-full max-w-sm"
			>
				<Card>
					<CardHeader className="text-center">
						<CardTitle className="text-2xl text-secondary">
							HipPocket Admin
						</CardTitle>
						<CardDescription>
							Sign in to the admin panel
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="space-y-4"
						>
							<div className="space-y-4">
								<Label htmlFor="username">Username</Label>
								<Input
									id="username"
									autoComplete="username"
									{...register('username')}
								/>
								{errors.username && (
									<p className="text-xs text-destructive">
										{errors.username.message}
									</p>
								)}
							</div>
							<div className="space-y-4">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									autoComplete="current-password"
									{...register('password')}
								/>
								{errors.password && (
									<p className="text-xs text-destructive">
										{errors.password.message}
									</p>
								)}
							</div>
							<Button
								type="submit"
								className="w-full mt-2"
								disabled={isSubmitting}
							>
								{isSubmitting && (
									<Loader2 className="animate-spin" />
								)}
								Sign in
							</Button>
						</form>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	)
}
