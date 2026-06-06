import { Icon } from '@/components/Icon'
import type { NavItem } from './useAppShell'

// The parent row of a `groupOnly` nav group — a group whose parent has no page
// of its own. It mirrors a top-level `NavItemLink` visually but is a button:
// clicking it opens the group and jumps to its first child (`onSelect`) instead
// of navigating to its own route. Active styling follows whether any of the
// group's routes is the current page (`isActive`).
export function NavGroupButton({
	item,
	onSelect,
}: {
	item: NavItem
	isActive: boolean
	onSelect: () => void
}) {
	return (
		<button type="button" onClick={onSelect} className="nav-link">
			<Icon name={item.icon} className="nav-link__icon" />
			<span className="nav-link__label">{item.label}</span>
		</button>
	)
}
