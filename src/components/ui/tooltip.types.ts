import type { ReactElement, ReactNode } from 'react'
import type * as TooltipPrimitive from '@radix-ui/react-tooltip'

export interface TooltipProps {
	/** The hover hint. Falsy content renders `children` with no tooltip. */
	content: ReactNode
	/** A single element that receives the hover/focus trigger behaviour. */
	children: ReactElement
	side?: TooltipPrimitive.TooltipContentProps['side']
	align?: TooltipPrimitive.TooltipContentProps['align']
	sideOffset?: number
	/** Hover delay before the tooltip opens (ms). Inherits the provider default. */
	delayDuration?: number
	/** Extra classes for the tooltip content. */
	className?: string
}
