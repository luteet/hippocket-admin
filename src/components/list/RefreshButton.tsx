import { Button } from '@/components/ui/button'
import { Icon } from '@/components/Icon'
import { cn } from '@/lib/utils'

// Quiet, icon-only refresh control. Rendered as an overlay pinned to the
// top-right corner of the DataTable card (see DataTable), so it stays out of the
// way until needed; the spinning icon doubles as the in-flight indicator.
export function RefreshButton({
	onRefresh,
	isFetching,
	className,
}: {
	onRefresh: () => void
	isFetching?: boolean
	className?: string
}) {
	return (
		<Button
			type="button"
			variant="ghost"
			size="icon"
			onClick={onRefresh}
			disabled={isFetching}
			aria-label="Refresh"
			title="Refresh"
			className={cn(
				'hover:text-foreground',
				className,
			)}
		>
			<Icon
				name="refresh-cw"
				className={isFetching ? 'animate-spin' : undefined}
			/>
		</Button>
	)
}
