import { Icon } from '@/components/Icon'
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover'
import { NavItemLink } from './NavItemLink'
import { NavGroupButton } from './NavGroupButton'
import { useNavGroup } from './useNavGroup'
import type { NavItem } from './useAppShell'

// A WordPress-style nav group: a parent row plus collapsible children. When the
// rail is collapsed the inline children are hidden, so a hover flyout pops them
// out beside the icon (portaled, escaping the sidebar's overflow clipping).
export function NavGroup({
	item,
	collapsed,
	isGroupOpen,
	toggleGroup,
	isGroupActive,
	selectGroup,
	closeMobile,
}: {
	item: NavItem
	collapsed: boolean
	isGroupOpen: (item: NavItem) => boolean
	toggleGroup: (item: NavItem) => void
	isGroupActive: (item: NavItem) => boolean
	selectGroup: (item: NavItem) => void
	closeMobile: () => void
}) {
	const {
		flyoutEnabled,
		flyoutOpen,
		setFlyoutOpen,
		openFlyout,
		scheduleClose,
		closeFlyout,
	} = useNavGroup(collapsed)

	const children = item.children ?? []

	// Navigating from the flyout closes both it and (on mobile) the drawer.
	const onFlyoutNavigate = () => {
		closeFlyout()
		closeMobile()
	}

	return (
		<Popover open={flyoutOpen} onOpenChange={setFlyoutOpen}>
			<div className="nav-group" data-open={isGroupOpen(item)}>
				<PopoverAnchor asChild>
					<div
						className="nav-group__row"
						onMouseEnter={flyoutEnabled ? openFlyout : undefined}
						onMouseLeave={flyoutEnabled ? scheduleClose : undefined}
					>
						{item.groupOnly ? (
							<NavGroupButton
								item={item}
								isActive={isGroupActive(item)}
								onSelect={() => {
									selectGroup(item)
									closeMobile()
								}}
							/>
						) : (
							<NavItemLink item={item} onNavigate={closeMobile} />
						)}
						<button
							type="button"
							className="nav-group__toggle"
							onClick={() => toggleGroup(item)}
							aria-label={`Toggle ${item.label}`}
							aria-expanded={isGroupOpen(item)}
						>
							<Icon
								name="chevron-down"
								className="nav-group__chevron"
							/>
						</button>
					</div>
				</PopoverAnchor>

				{/* Inline children: expanded desktop + the mobile drawer. */}
				<div className="nav-group__children">
					<div className="nav-group__children-inner">
						{children.map((child) => (
							<NavItemLink
								key={child.to}
								item={child}
								isSub
								onNavigate={closeMobile}
							/>
						))}
					</div>
				</div>
			</div>

			{/* Collapsed rail: hover flyout exposing the otherwise-hidden
			    children. Portaled, so it isn't clipped by the sidebar overflow. */}
			{flyoutEnabled && (
				<PopoverContent
					side="right"
					align="start"
					sideOffset={24}
					className="nav-flyout w-auto min-w-44 border-sidebar-border bg-sidebar p-1.5 text-sidebar-foreground"
					onOpenAutoFocus={(e) => e.preventDefault()}
					onMouseEnter={openFlyout}
					onMouseLeave={scheduleClose}
				>
					<div className="nav-flyout__label">{item.label}</div>
					<div className="nav-flyout__items">
						{children.map((child) => (
							<NavItemLink
								key={child.to}
								item={child}
								isSub
								onNavigate={onFlyoutNavigate}
							/>
						))}
					</div>
				</PopoverContent>
			)}
		</Popover>
	)
}
