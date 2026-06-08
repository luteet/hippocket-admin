import { Icon } from '@/components/Icon'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/AuthContext'
import { NavItemLink } from './NavItemLink'
import { NavGroupButton } from './NavGroupButton'
import { NAV_ITEMS, type NavItem } from './useAppShell'

export function Sidebar({
	collapsed,
	toggleCollapsed,
	mobileOpen,
	closeMobile,
	isGroupOpen,
	toggleGroup,
	isGroupActive,
	selectGroup,
}: {
	collapsed: boolean
	toggleCollapsed: () => void
	mobileOpen: boolean
	closeMobile: () => void
	isGroupOpen: (item: NavItem) => boolean
	toggleGroup: (item: NavItem) => void
	isGroupActive: (item: NavItem) => boolean
	selectGroup: (item: NavItem) => void
}) {
	const { logout } = useAuth()
	return (
		<aside
			className="sidebar"
			data-collapsed={collapsed}
			data-open={mobileOpen}
		>
			<div className="sidebar-inner">
				{/* Header: brand + toggles */}
				<div className="sidebar__header">
					{!collapsed && <span className="brand">HipPocket</span>}
					{/* Desktop collapse toggle */}
					<Button
						variant="ghost"
						size="icon"
						onClick={toggleCollapsed}
						aria-label="Toggle sidebar"
						className="hidden size-9 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground md:inline-flex"
					>
						{collapsed ? (
							<Icon name="panel-left-open" />
						) : (
							<Icon name="panel-left-close" />
						)}
					</Button>
					{/* Mobile close */}
					<Button
						variant="ghost"
						size="icon"
						onClick={closeMobile}
						aria-label="Close menu"
						className="ml-auto text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground md:hidden"
					>
						<Icon name="x" />
					</Button>
				</div>

				<nav className="nav">
					{NAV_ITEMS.map((item) =>
						item.children ? (
							<div
								key={item.to}
								className="nav-group"
								data-open={isGroupOpen(item)}
							>
								<div className="nav-group__row">
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
										<NavItemLink
											item={item}
											onNavigate={closeMobile}
										/>
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
								<div className="nav-group__children">
									<div className="nav-group__children-inner">
										{item.children.map((child) => (
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
						) : (
							<NavItemLink
								key={item.to}
								item={item}
								onNavigate={closeMobile}
							/>
						),
					)}
				</nav>

				{/* Logout */}
				<div className="sidebar__footer">
					<Button
						variant="ghost"
						onClick={logout}
						className={cn(
							'w-full gap-3 text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-foreground',
							collapsed
								? 'md:justify-center md:px-0'
								: 'justify-start',
						)}
					>
						<Icon name="log-out" className="size-5 shrink-0" />
						<span className={cn(collapsed && 'md:hidden')}>
							Sign out
						</span>
					</Button>
				</div>
			</div>
		</aside>
	)
}
