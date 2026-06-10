import type { MouseEvent } from 'react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/Icon'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'

interface CopyButtonProps {
	/** The text put on the clipboard when clicked. */
	value: string | number
	/** Accessible label / hover hint (e.g. "Copy ID"). */
	label?: string
	className?: string
}

/**
 * An unobtrusive ghost icon button that copies `value` to the clipboard and
 * briefly swaps the copy glyph for a success check. Stops click propagation so
 * a copy click inside a clickable table row doesn't trigger row navigation.
 */
export function CopyButton({
	value,
	label = 'Copy',
	className,
}: CopyButtonProps) {
	const { copy, copied } = useCopyToClipboard()

	const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation()
		void copy(String(value))
	}

	return (
		<Button
			type="button"
			variant="ghost"
			size="icon"
			aria-label={label}
			title={label}
			onClick={handleClick}
			className={cn('size-6 text-muted-foreground', className)}
		>
			<Icon name={copied ? 'check' : 'copy'} className="size-3.5" />
		</Button>
	)
}
