import { Suspense } from 'react'
import { NavLink } from 'react-router'
import { AnimatePresence } from 'motion/react'
import {
	LogOut,
	Menu,
	X,
	ChevronDown,
	PanelLeftClose,
	PanelLeftOpen,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { PageTransition } from '@/components/PageTransition'
import { PageFallback } from '@/components/PageFallback'
import { Scrollbar } from '@/components/Scrollbar'
import { useAppShell, type NavItem } from './useAppShell'

// A leaf navigation link. Shared by top-level items and group children
// (`isSub` switches it to the nested styling).
function NavItemLink({
	item,
	isSub,
	onNavigate,
}: {
	item: NavItem
	isSub?: boolean
	onNavigate: () => void
}) {
	const Icon = item.icon
	return (
		<NavLink
			to={item.to}
			onClick={onNavigate}
			className={({ isActive }) =>
				cn('nav-link', isSub && 'nav-sublink', isActive && 'is-active')
			}
		>
			{/* Child links drop the icon to save horizontal space. */}
			{!isSub && <Icon className="nav-link__icon" />}
			<span className="nav-link__label">{item.label}</span>
		</NavLink>
	)
}

export function AppShell() {
	const {
		logout,
		pathname,
		outlet,
		isMobile,
		collapsed,
		toggleCollapsed,
		mobileOpen,
		openMobile,
		closeMobile,
		navItems,
		isGroupOpen,
		toggleGroup,
	} = useAppShell()

	return (
		<div className="shell">
			{/* Mobile backdrop */}
			<div
				className="backdrop"
				data-open={mobileOpen}
				onClick={closeMobile}
			/>

			{/* Sidebar */}
			<aside
				className="sidebar"
				data-collapsed={collapsed}
				data-open={mobileOpen}
			>
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
						{collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
					</Button>
					{/* Mobile close */}
					<Button
						variant="ghost"
						size="icon"
						onClick={closeMobile}
						aria-label="Close menu"
						className="ml-auto text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground md:hidden"
					>
						<X />
					</Button>
				</div>

				<nav className="nav">
					{navItems.map((item) =>
						item.children ? (
							<div
								key={item.to}
								className="nav-group"
								data-open={isGroupOpen(item)}
							>
								<div className="nav-group__row">
									<NavItemLink
										item={item}
										onNavigate={closeMobile}
									/>
									<button
										type="button"
										className="nav-group__toggle"
										onClick={() => toggleGroup(item)}
										aria-label={`Toggle ${item.label}`}
										aria-expanded={isGroupOpen(item)}
									>
										<ChevronDown className="nav-group__chevron" />
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
						<LogOut className="size-5 shrink-0" />
						<span className={cn(collapsed && 'md:hidden')}>
							Sign out
						</span>
					</Button>
				</div>
			</aside>

			{/* Content */}
			<div className="content">
				{/* Mobile top bar */}
				<header className="topbar">
					<Button
						variant="ghost"
						size="icon"
						onClick={openMobile}
						aria-label="Open menu"
					>
						<Menu />
					</Button>
					<span className="text-lg font-semibold text-secondary">
						HipPocket
					</span>
				</header>

				{/* Padding on the inner wrapper (not the scroll host) so the
				    bottom/right spacing is part of the scroll flow. */}
				{(() => {
					const inner = (
						<div className="main-pad">
							<Suspense fallback={<PageFallback />}>
								<AnimatePresence mode="wait" initial={false}>
									<PageTransition key={pathname}>
										{outlet}
									</PageTransition>
								</AnimatePresence>
							</Suspense>
						</div>
					)

					// Mobile: plain <main> so the whole page scrolls natively.
					// Desktop: custom OverlayScrollbars scroll host.
					return isMobile ? (
						<main className="min-h-0 flex-1">{inner}</main>
					) : (
						<Scrollbar element="main" className="min-h-0 flex-1">
							{inner}
						</Scrollbar>
					)
				})()}
			</div>
		</div>
	)
}
