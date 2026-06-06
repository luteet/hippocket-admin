import { NavLink } from 'react-router'

import { Icon } from '@/components/Icon'
import { cn } from '@/lib/utils'
import type { NavItem } from './useAppShell'

// A leaf navigation link. Shared by top-level items and group children
// (`isSub` switches it to the nested styling).
export function NavItemLink({
	item,
	isSub,
	onNavigate,
}: {
	item: NavItem
	isSub?: boolean
	onNavigate: () => void
}) {
	return (
		<NavLink
			to={item.to}
			end={item.end}
			onClick={onNavigate}
			className={({ isActive }) =>
				cn('nav-link', isSub && 'nav-sublink', isActive && 'is-active')
			}
		>
			{/* Child links drop the icon to save horizontal space. */}
			{!isSub && <Icon name={item.icon} className="nav-link__icon" />}
			<span className="nav-link__label">{item.label}</span>
		</NavLink>
	)
}
