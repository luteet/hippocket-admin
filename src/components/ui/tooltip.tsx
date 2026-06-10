import {
	forwardRef,
	type ComponentPropsWithoutRef,
	type ComponentRef,
} from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

import type { TooltipProps } from '@/components/ui/tooltip.types'
import { cn } from '@/lib/utils'

export type { TooltipProps }

// `TooltipProvider` is mounted once at the app root (see App.tsx) so any
// `<Tooltip>` works without its own provider. The low-level primitives are
// exported for advanced layouts; reach for the `Tooltip` wrapper by default.
const TooltipProvider = TooltipPrimitive.Provider
const TooltipRoot = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = forwardRef<
	ComponentRef<typeof TooltipPrimitive.Content>,
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
