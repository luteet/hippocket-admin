import {
	forwardRef,
	type ComponentRef,
	type ComponentPropsWithoutRef,
} from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'

import { cn } from '@/lib/utils'

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuContent = forwardRef<
	ComponentRef<typeof DropdownMenuPrimitive.Content>,
	ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> & {
		container?: HTMLElement | null
	}
>(({ className, sideOffset = 4, container, ...props }, ref) => (
	<DropdownMenuPrimitive.Portal container={container}>
		<DropdownMenuPrimitive.Content
			ref={ref}
			sideOffset={sideOffset}
			className={cn('dropdown-content', className)}
			{...props}
		/>
	</DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = forwardRef<
	ComponentRef<typeof DropdownMenuPrimitive.Item>,
	ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
		inset?: boolean
		variant?: 'default' | 'destructive'
	}
>(({ className, inset, variant = 'default', ...props }, ref) => (
	<DropdownMenuPrimitive.Item
		ref={ref}
		className={cn(
			'dropdown-item',
			inset && 'is-inset',
			variant === 'destructive' && 'is-destructive',
			className,
		)}
		{...props}
	/>
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuLabel = forwardRef<
	ComponentRef<typeof DropdownMenuPrimitive.Label>,
	ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ className, ...props }, ref) => (
	<DropdownMenuPrimitive.Label
		ref={ref}
		className={cn('dropdown-label', className)}
		{...props}
	/>
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = forwardRef<
	ComponentRef<typeof DropdownMenuPrimitive.Separator>,
	ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<DropdownMenuPrimitive.Separator
		ref={ref}
		className={cn('dropdown-separator', className)}
		{...props}
	/>
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

export {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuGroup,
	DropdownMenuSeparator,
}
