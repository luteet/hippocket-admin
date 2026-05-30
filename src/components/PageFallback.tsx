import { cn } from '@/lib/utils'
import { Spinner } from '@/components/Spinner'

export function PageFallback({ fullScreen = false }: { fullScreen?: boolean }) {
	return (
		<div
			className={cn(
				'flex w-full items-center justify-center',
				fullScreen ? 'min-h-dvh' : 'h-full min-h-60',
			)}
		>
			<Spinner />
		</div>
	)
}
