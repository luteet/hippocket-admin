import type { ButtonSize, ButtonVariant } from '@/components/ui/button.types'

// Styles live in src/styles/components/_button.scss (.button + .is-* modifiers).
export const VARIANT_CLASS: Record<ButtonVariant, string> = {
	default: '',
	secondary: 'is-secondary',
	destructive: 'is-destructive',
	outline: 'is-outline',
	'outline-2': 'is-outline-2',
	ghost: 'is-ghost',
	link: 'is-link',
}

export const SIZE_CLASS: Record<ButtonSize, string> = {
	default: '',
	sm: 'is-sm',
	lg: 'is-lg',
	icon: 'is-icon',
}
