import { Icon } from '@/components/Icon'
import { Tooltip } from '@/components/ui/tooltip'
import { MOD_KEY_LABEL } from './useGlobalSearch'

/**
 * Small icon button that opens the command palette. Pinned top-right of the
 * content area on desktop (hidden on mobile — the topbar has its own button).
 * The ⌘K / Ctrl+K hint slides out on hover.
 */
export function SearchTrigger({ onClick }: { onClick: () => void }) {
	return (
		<Tooltip content={`Search (${MOD_KEY_LABEL}K)`}>
			<button
				type="button"
				className="search-trigger"
				onClick={onClick}
				aria-label="Search"
			>
				<Icon name="search" className="size-4" />
				<kbd className="search-trigger__kbd">{MOD_KEY_LABEL}K</kbd>
			</button>
		</Tooltip>
	)
}
