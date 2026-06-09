import { useEffect, useRef } from 'react'

import { Icon } from '@/components/Icon'
import type { PaletteItem } from '../useCommandPalette'

interface CommandRowProps {
	item: PaletteItem
	active: boolean
	onHover: () => void
}

/** A single result row in the command palette. */
export function CommandRow({ item, active, onHover }: CommandRowProps) {
	const ref = useRef<HTMLButtonElement>(null)

	// Keep the keyboard-selected row in view as selection moves.
	useEffect(() => {
		if (active) ref.current?.scrollIntoView({ block: 'nearest' })
	}, [active])

	return (
		<button
			ref={ref}
			type="button"
			className="command-row"
			data-active={active}
			onMouseMove={onHover}
			onClick={item.onSelect}
		>
			<span className="command-row__icon">
				<Icon name={item.icon} className="size-4" />
			</span>
			<span className="command-row__text">
				<span className="command-row__title">
					{item.prefix && (
						<span className="command-row__prefix">
							{item.prefix} ›{' '}
						</span>
					)}
					{item.title}
				</span>
				{item.subtitle && (
					<span className="command-row__sub">{item.subtitle}</span>
				)}
			</span>
			<span className="command-row__trailing">
				{item.trailing === 'scope' ? (
					<Icon name="chevron-right" className="size-4" />
				) : (
					active && <kbd className="command-kbd">↵</kbd>
				)}
			</span>
		</button>
	)
}
