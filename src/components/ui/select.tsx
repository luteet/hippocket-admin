import {
	forwardRef,
	type ElementRef,
	type ComponentPropsWithoutRef,
} from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'

import { Icon } from '@/components/Icon'
import { cn } from '@/lib/utils'

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const SelectTrigger = forwardRef<
	ElementRef<typeof SelectPrimitive.Trigger>,
	ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
	<SelectPrimitive.Trigger
		ref={ref}
		className={cn('select-trigger', className)}
		{...props}
	>
		{children}
		<SelectPrimitive.Icon asChild>
			<Icon name="chevron-down" className="select-trigger-icon" />
		</SelectPrimitive.Icon>
	</SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = forwardRef<
	ElementRef<typeof SelectPrimitive.Content>,
	ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
	<SelectPrimitive.Portal>
		<SelectPrimitive.Content
			ref={ref}
			className={cn(
				'select-content',
				position === 'popper' && 'is-popper',
				className,
			)}
			position={position}
			{...props}
		>
			<SelectPrimitive.ScrollUpButton className="select-scroll-button">
				<Icon name="chevron-up" className="size-4" />
			</SelectPrimitive.ScrollUpButton>
			<SelectPrimitive.Viewport
				className={cn(
					'select-viewport',
					position === 'popper' && 'is-popper',
				)}
			>
				{children}
			</SelectPrimitive.Viewport>
			<SelectPrimitive.ScrollDownButton className="select-scroll-button">
				<Icon name="chevron-down" className="size-4" />
			</SelectPrimitive.ScrollDownButton>
		</SelectPrimitive.Content>
	</SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectItem = forwardRef<
	ElementRef<typeof SelectPrimitive.Item>,
	ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
	<SelectPrimitive.Item
		ref={ref}
		className={cn('select-item', className)}
		{...props}
	>
		<span className="select-item-indicator">
			<SelectPrimitive.ItemIndicator>
				<Icon name="check" className="size-4" />
			</SelectPrimitive.ItemIndicator>
		</span>
		<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
	</SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

export {
	Select,
	SelectGroup,
	SelectValue,
	SelectTrigger,
	SelectContent,
	SelectItem,
}
