import type { ButtonHTMLAttributes } from 'react'

export type ButtonVariant =
	| 'default'
	| 'secondary'
	| 'destructive'
	| 'outline'
	| 'outline-2'
	| 'ghost'
	| 'link'

export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant
	size?: ButtonSize
	asChild?: boolean
}
