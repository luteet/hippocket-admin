import { Icon } from '@/components/Icon'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

// The list toolbar's search box: a magnifier icon overlaid on a left-padded
// input. Shared by every list page so the markup stays in one place.
export function SearchInput({
	value,
	onChange,
	placeholder,
	className,
}: {
	value: string
	onChange: (value: string) => void
	placeholder?: string
	className?: string
}) {
	return (
		<div className={cn('relative', className)}>
			<Icon
				name="search"
				className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
			/>
			<Input
				placeholder={placeholder}
				className="pl-9"
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
		</div>
	)
}
