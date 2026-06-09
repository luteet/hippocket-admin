import { Suspense } from 'react'
import { AnimatePresence } from 'motion/react'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { PageTransition } from '@/components/PageTransition'
import { PageFallback } from '@/components/PageFallback'
import { Scrollbar } from '@/components/Scrollbar'
import { CommandPalette } from '@/features/search/CommandPalette'
import { SearchTrigger } from '@/features/search/SearchTrigger'
import { useGlobalSearch } from '@/features/search/useGlobalSearch'
import { Sidebar } from './Sidebar'
import { useAppShell } from './useAppShell'

export function AppShell() {
	const {
		pathname,
		outlet,
		isMobile,
		collapsed,
		toggleCollapsed,
		mobileOpen,
		openMobile,
		closeMobile,
		isGroupOpen,
		toggleGroup,
		isGroupActive,
		selectGroup,
	} = useAppShell()
	const { open, openSearch, closeSearch } = useGlobalSearch()

	return (
		<div className="shell">
			{/* Mobile backdrop */}
			<div
				className="backdrop"
				data-open={mobileOpen}
				onClick={closeMobile}
			/>

			<Sidebar
				collapsed={collapsed}
				toggleCollapsed={toggleCollapsed}
				mobileOpen={mobileOpen}
				closeMobile={closeMobile}
				isGroupOpen={isGroupOpen}
				toggleGroup={toggleGroup}
				isGroupActive={isGroupActive}
				selectGroup={selectGroup}
			/>

			{/* Content */}
			<div className="content">
				{/* Desktop search trigger, pinned top-right of the content. */}
				<SearchTrigger onClick={openSearch} />

				{/* Mobile top bar */}
				<header className="topbar">
					<Button
						variant="ghost"
						size="icon"
						onClick={openMobile}
						aria-label="Open menu"
					>
						<Icon name="menu" />
					</Button>
					<span className="text-lg font-semibold text-secondary">
						HipPocket
					</span>
					<Button
						variant="ghost"
						size="icon"
						className="ml-auto"
						onClick={openSearch}
						aria-label="Search"
					>
						<Icon name="search" />
					</Button>
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

			<CommandPalette open={open} onClose={closeSearch} />
		</div>
	)
}
