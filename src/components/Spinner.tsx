import { cn } from '@/lib/utils'

// Ring spinner styled in src/styles/main.scss (`.spinner`).
export function Spinner({ className }: { className?: string }) {
	return (
		<span
			role="status"
			aria-label="Loading"
			className={cn('spinner inline-block size-10', className)}
		/>
	)
}
