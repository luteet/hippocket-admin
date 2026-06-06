import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { PAGE_SIZE_OPTIONS } from '@/hooks/usePagination'
import { cn } from '@/lib/utils'

// The "N per page" selector shared by every list page's toolbar.
export function PageSizeSelect({
	count,
	onCountChange,
	className,
}: {
	count: number
	onCountChange: (count: number) => void
	className?: string
}) {
	return (
		<Select
			value={String(count)}
			onValueChange={(v) => onCountChange(Number(v))}
		>
			<SelectTrigger className={cn('sm:w-38', className)}>
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{PAGE_SIZE_OPTIONS.map((n) => (
					<SelectItem key={n} value={String(n)}>
						{n} per page
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
