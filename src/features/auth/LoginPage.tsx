import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { useLoginPage } from './useLoginPage'

export function LoginPage() {
	const { register, errors, isSubmitting, onSubmit } = useLoginPage()

	return (
		<div className="flex min-h-dvh items-center justify-center bg-background p-4 pt-12 pb-12">
			<div className="w-full max-w-sm">
				<header className="pb-12 text-center">
					<h1 className="text-2xl font-semibold leading-none tracking-tight uppercase">
						Login
					</h1>
					<p className="pt-4 text-muted-foreground">
						Sign in to the admin panel
					</p>
				</header>
				<Card>
					<CardContent>
						<form onSubmit={onSubmit} className="space-y-4">
							<div className="space-y-4">
								<Label htmlFor="username">Username</Label>
								<Input
									id="username"
									autoComplete="username"
									placeholder="Username"
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
									placeholder="Password"
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
								className="w-full mt-4"
								disabled={isSubmitting}
							>
								{isSubmitting && (
									<Icon
										name="loader"
										className="animate-spin"
									/>
								)}
								Sign in
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
