import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import type { RefOption } from '@/types/api'

export function RefSelect({
	value,
	options,
	placeholder,
	onChange,
	onCreate,
}: {
	value?: string
	options: RefOption[]
	placeholder: string
	onChange: (value: string) => void
	onCreate: () => void
}) {
	return (
		<div className="flex gap-2">
			<div className="relative flex-1">
				<Select value={value || undefined} onValueChange={onChange}>
					<SelectTrigger
						className={value ? '[&>span]:pr-8' : undefined}
					>
						<SelectValue placeholder={placeholder} />
					</SelectTrigger>
					<SelectContent>
						{options.map((o) => (
							<SelectItem key={o.id} value={o.id}>
								{o.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{value && (
					<button
						type="button"
						aria-label="Clear selection"
						onPointerDown={(e) => e.stopPropagation()}
						onClick={(e) => {
							e.stopPropagation()
							onChange('')
						}}
						className="absolute right-8 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground hover:text-foreground"
					>
						<Icon name="x" className="size-4" />
					</button>
				)}
			</div>
			<Button
				type="button"
				variant="outline-2"
				size="icon"
				className="h-10 sm2:h-14"
				aria-label="Create new option"
				onClick={onCreate}
			>
				<Icon name="plus" className="size-4" />
			</Button>
		</div>
	)
}
