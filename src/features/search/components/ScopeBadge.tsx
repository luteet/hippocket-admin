import { Icon } from '@/components/Icon'
import type { IconName } from '@/components/Icon'

interface ScopeBadgeProps {
	icon: IconName
	label: string
	onClear: () => void
}

/**
 * Breadcrumb pill shown in the palette input while an entity scope is active
 * (e.g. "Agents ✕"). Clicking it backs out of the scope.
 */
export function ScopeBadge({ icon, label, onClear }: ScopeBadgeProps) {
	return (
		<button
			type="button"
			className="command-scope"
			onClick={onClear}
			aria-label={`Exit ${label} search`}
		>
			<Icon name={icon} className="size-3.5" />
			<span>{label}</span>
			<Icon name="x" className="size-3.5 command-scope__x" />
		</button>
	)
}
