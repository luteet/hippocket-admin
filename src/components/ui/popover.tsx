import {
	forwardRef,
	type ComponentRef,
	type ComponentPropsWithoutRef,
} from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'

import { cn } from '@/lib/utils'

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger
const PopoverAnchor = PopoverPrimitive.Anchor

const PopoverContent = forwardRef<
	ComponentRef<typeof PopoverPrimitive.Content>,
	ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
		// Override the portal target. Defaults to <body>; pass a node inside
		// another popover to nest this content within that layer's DOM.
		container?: HTMLElement | null
	}
>(
	(
		{ className, align = 'center', sideOffset = 4, container, ...props },
		ref,
	) => (
		<PopoverPrimitive.Portal container={container}>
			<PopoverPrimitive.Content
				ref={ref}
				align={align}
				sideOffset={sideOffset}
				className={cn(
					'z-50 w-72 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
					className,
				)}
				{...props}
			/>
		</PopoverPrimitive.Portal>
	),
)
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
