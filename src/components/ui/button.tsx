import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'

import { SIZE_CLASS, VARIANT_CLASS } from '@/components/ui/button.constants'
import type { ButtonProps } from '@/components/ui/button.types'
import { cn } from '@/lib/utils'

export type { ButtonProps }

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
