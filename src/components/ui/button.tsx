import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Slot } from '@radix-ui/react-slot'

import { cn } from '@/lib/utils'

type ButtonVariant =
	| 'default'
	| 'secondary'
	| 'destructive'
	| 'outline'
	| 'outline-2'
	| 'ghost'
	| 'link'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

// Styles live in src/styles/components/_button.scss (.button + .is-* modifiers).
const VARIANT_CLASS: Record<ButtonVariant, string> = {
	default: '',
	secondary: 'is-secondary',
	destructive: 'is-destructive',
	outline: 'is-outline',
	"outline-2": 'is-outline-2',
	ghost: 'is-ghost',
	link: 'is-link',
}

const SIZE_CLASS: Record<ButtonSize, string> = {
	default: '',
	sm: 'is-sm',
	lg: 'is-lg',
	icon: 'is-icon',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant
	size?: ButtonSize
	asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant = 'default',
			size = 'default',
			asChild = false,
			...props
		},
		ref,
	) => {
		const Comp = asChild ? Slot : 'button'
		return (
			<Comp
				className={cn(
					'button',
					VARIANT_CLASS[variant],
					SIZE_CLASS[size],
					className,
				)}
				ref={ref}
				{...props}
			/>
		)
	},
)
Button.displayName = 'Button'

export { Button }
