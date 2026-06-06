import {
	forwardRef,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
	type ElementRef,
	type ComponentPropsWithoutRef,
} from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'

import { Icon } from '@/components/Icon'
import { cn } from '@/lib/utils'

// Radix Select unmounts its content the instant `open` flips to false (it has
// no `forceMount`), so a CSS/motion close animation never gets to play — the
// dropdown opens with a fade but snaps shut. Work around it by controlling
// `open` here and delaying the real unmount by the fade-out length, exposing a
// `closing` flag the content reads to play the exit. Must match the
// `select-fade-out` duration in _select.scss.
const CLOSE_DURATION = 150

const SelectCloseContext = createContext(false)

const Select = ({
	open: openProp,
	defaultOpen,
	onOpenChange,
	...props
}: ComponentPropsWithoutRef<typeof SelectPrimitive.Root>) => {
	const [open, setOpen] = useState(openProp ?? defaultOpen ?? false)
	const [closing, setClosing] = useState(false)
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

	useEffect(() => () => clearTimeout(timer.current), [])

	const handleOpenChange = useCallback(
		(next: boolean) => {
			if (next) {
				clearTimeout(timer.current)
				setClosing(false)
				setOpen(true)
				onOpenChange?.(true)
			} else {
				// Keep Radix mounted (closing) for the fade, then unmount.
				setClosing(true)
				timer.current = setTimeout(() => {
					setOpen(false)
					setClosing(false)
					onOpenChange?.(false)
				}, CLOSE_DURATION)
			}
		},
		[onOpenChange],
	)

	return (
		<SelectCloseContext.Provider value={closing}>
			<SelectPrimitive.Root
				open={open}
				onOpenChange={handleOpenChange}
				{...props}
			/>
		</SelectCloseContext.Provider>
	)
}
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
	ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
		// Override the portal target. Defaults to <body>; pass a node inside a
		// Popover/Dialog so the dropdown is part of that layer's DOM and
		// interacting with it doesn't read as an "outside" dismissal.
		container?: HTMLElement | null
	}
>(({ className, children, position = 'popper', container, ...props }, ref) => {
	const closing = useContext(SelectCloseContext)
	return (
		<SelectPrimitive.Portal container={container}>
			<SelectPrimitive.Content
				ref={ref}
				className={cn(
					'select-content',
					position === 'popper' && 'is-popper',
					className,
				)}
				position={position}
				data-closing={closing}
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
	)
})
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
