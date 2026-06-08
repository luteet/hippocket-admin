import { Icon, type IconName } from '@/components/Icon'
import { Button } from '@/components/ui/button'

/** The button variants the detail header uses (a subset of Button's variants). */
export type DetailButtonVariant =
	| 'outline'
	| 'secondary'
	| 'destructive'
	| 'default'

/**
 * One action button in a detail page header: an icon plus a label that collapses
 * to icon-only below the `sm` breakpoint. Shared by the Back / Edit / Delete and
 * any extra actions so the responsive markup lives in one place.
 */
export function DetailHeaderButton({
	label,
	icon,
	variant = 'secondary',
	onClick,
}: {
	label: string
	icon: IconName
	variant?: DetailButtonVariant
	onClick: () => void
}) {
	return (
		<Button variant={variant} onClick={onClick} aria-label={label}>
			<Icon name={icon} />
			<span className="sm:inline hidden">{label}</span>
		</Button>
	)
}
