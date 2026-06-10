import {
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
	type ReactElement,
	type ReactNode,
} from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

import { cn } from '@/lib/utils'

// `TooltipProvider` is mounted once at the app root (see App.tsx) so any
// `<Tooltip>` works without its own provider. The low-level primitives are
// exported for advanced layouts; reach for the `Tooltip` wrapper by default.
const TooltipProvider = TooltipPrimitive.Provider
const TooltipRoot = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = forwardRef<
	ElementRef<typeof TooltipPrimitive.Content>,
	ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
	<TooltipPrimitive.Portal>
		<TooltipPrimitive.Content
			ref={ref}
			sideOffset={sideOffset}
			className={cn('tooltip', className)}
			{...props}
		/>
	</TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

interface TooltipProps {
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

/**
 * Custom replacement for the native `title` attribute: a styled, on-brand
 * tooltip. Wrap any element — `<Tooltip content="Edit"><Button …/></Tooltip>`.
 * Requires a `TooltipProvider` ancestor (mounted at the app root).
 */
function Tooltip({
	content,
	children,
	side = 'top',
	align = 'center',
	sideOffset,
	delayDuration,
	className,
}: TooltipProps) {
	if (content === null || content === undefined || content === '')
		return children

	return (
		<TooltipRoot delayDuration={delayDuration}>
			<TooltipTrigger asChild>{children}</TooltipTrigger>
			<TooltipContent
				side={side}
				align={align}
				sideOffset={sideOffset}
				className={className}
			>
				{content}
			</TooltipContent>
		</TooltipRoot>
	)
}

export { Tooltip, TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent }
