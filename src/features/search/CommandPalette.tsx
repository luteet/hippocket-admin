import * as DialogPrimitive from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'motion/react'

import { Icon } from '@/components/Icon'
import { CommandRow } from './components/CommandRow'
import { ScopeBadge } from './components/ScopeBadge'
import { MOD_KEY_LABEL } from './useGlobalSearch'
import { useCommandPalette } from './useCommandPalette'

interface CommandPaletteProps {
	open: boolean
	onClose: () => void
}

// Plain eased fade in/out for both the scrim and the panel — no scale/translate.
const OVERLAY_MOTION = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
	transition: { duration: 0.18, ease: 'easeOut' },
} as const

const PANEL_MOTION = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
	transition: { duration: 0.18, ease: 'easeOut' },
} as const

/**
 * Spotlight-style command palette: searches the nav (with descriptions and
 * keywords) and can dive into a live agent search. Opened via the search
 * trigger or the ⌘K / Ctrl+K hotkey (see {@link useGlobalSearch}).
 */
export function CommandPalette({ open, onClose }: CommandPaletteProps) {
	const {
		query,
		setQuery,
		scope,
		exitScope,
		sections,
		selected,
		setSelected,
		onInputKeyDown,
		onEscapeKeyDown,
		placeholder,
		resultsLoading,
		resultsHasQuery,
		isEmpty,
	} = useCommandPalette(open, onClose)

	return (
		<DialogPrimitive.Root
			open={open}
			onOpenChange={(next) => !next && onClose()}
		>
			{/* forceMount + AnimatePresence so motion controls enter/exit. */}
			<AnimatePresence>
				{open && (
					<DialogPrimitive.Portal forceMount>
						<DialogPrimitive.Overlay asChild forceMount>
							<motion.div
								className="command-overlay"
								{...OVERLAY_MOTION}
							/>
						</DialogPrimitive.Overlay>

						<DialogPrimitive.Content
							asChild
							forceMount
							onEscapeKeyDown={onEscapeKeyDown}
							// Keep focus on our input rather than the first row.
							onOpenAutoFocus={(e) => e.preventDefault()}
							aria-describedby={undefined}
						>
							<motion.div
								className="command-panel"
								{...PANEL_MOTION}
							>
								<DialogPrimitive.Title className="sr-only">
									Search
								</DialogPrimitive.Title>

								<div className="command-input-row">
									<Icon
										name="search"
										className="size-5 command-input-row__icon"
									/>
									{scope && (
										<ScopeBadge
											icon={scope.icon}
											label={scope.label}
											onClear={exitScope}
										/>
									)}
									<input
										autoFocus
										className="command-input"
										value={query}
										placeholder={placeholder}
										onChange={(e) =>
											setQuery(e.target.value)
										}
										onKeyDown={onInputKeyDown}
									/>
								</div>

								<div className="command-list">
									{sections.map((section) => (
										<div
											key={section.id}
											className="command-section"
										>
											<div className="command-section__label">
												{section.label}
											</div>
											{section.items.map((item) => (
												<CommandRow
													key={item.id}
													item={item}
													active={
														item.index === selected
													}
													onHover={() =>
														setSelected(item.index)
													}
												/>
											))}
										</div>
									))}

									{isEmpty && (
										<div className="command-empty">
											{scope && resultsLoading
												? 'Searching…'
												: scope && !resultsHasQuery
													? `Type to search ${scope.label.toLowerCase()}`
													: 'No results'}
										</div>
									)}
								</div>

								<div className="command-footer">
									<span className="command-footer__hint">
										<kbd className="command-kbd">↑</kbd>
										<kbd className="command-kbd">↓</kbd>
										to navigate
									</span>
									<span className="command-footer__hint">
										<kbd className="command-kbd">↵</kbd>
										to select
									</span>
									<span className="command-footer__hint">
										<kbd className="command-kbd">esc</kbd>
										{scope ? 'to exit' : 'to close'}
									</span>
									<span className="command-footer__spacer" />
									<span className="command-footer__hint">
										<kbd className="command-kbd">
											{MOD_KEY_LABEL}K
										</kbd>
									</span>
								</div>
							</motion.div>
						</DialogPrimitive.Content>
					</DialogPrimitive.Portal>
				)}
			</AnimatePresence>
		</DialogPrimitive.Root>
	)
}
