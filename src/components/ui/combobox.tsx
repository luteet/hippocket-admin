import { Icon } from '@/components/Icon'
import { Input } from '@/components/ui/input'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import type { ComboboxProps } from '@/components/ui/combobox.types'
import { useCombobox } from '@/components/ui/useCombobox'
import { cn } from '@/lib/utils'

export type { ComboboxProps }

/**
 * A single-select dropdown with a search field, for option lists too long to
 * scan in a plain {@link Select}. Visually matches the Select (reuses its
 * `.select-*` classes) but renders its own list so it can be filtered. Driven
 * by a `value`/`onValueChange` pair like Select, so it drops into the form
 * renderer's `Controller`.
 *
 * Filters client-side by default; pass `onSearch` to search server-side for
 * lists too large to load in full.
 */
export function Combobox(props: ComboboxProps) {
	const {
		value,
		placeholder = 'Select…',
		searchPlaceholder = 'Search…',
		emptyText = 'No results',
		disabled,
		loading,
		loadingMore,
	} = props
	const {
		open,
		query,
		active,
		listRef,
		displayLabel,
		filtered,
		choose,
		setActive,
		onOpenChange,
		onQueryChange,
		onListScroll,
		onInputKeyDown,
	} = useCombobox(props)

	return (
		<Popover open={open} onOpenChange={onOpenChange}>
			<PopoverTrigger asChild>
				<button
					type="button"
					disabled={disabled}
					className="select-trigger"
					data-placeholder={displayLabel ? undefined : ''}
				>
					<span>{displayLabel || placeholder}</span>
					<Icon name="chevron-down" className="select-trigger-icon" />
				</button>
			</PopoverTrigger>
			<PopoverContent
				align="start"
				className="w-(--radix-popover-trigger-width) overflow-hidden p-0"
			>
				<div className="border-b border-border p-2">
					<Input
						autoFocus
						value={query}
						onChange={(e) => onQueryChange(e.target.value)}
						onKeyDown={onInputKeyDown}
						placeholder={searchPlaceholder}
					/>
				</div>
				<div
					ref={listRef}
					onScroll={onListScroll}
					className="max-h-60 overflow-y-auto p-1"
				>
					{loading && filtered.length === 0 ? (
						<div className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground">
							<Icon
								name="loader"
								className="size-4 animate-spin"
							/>
							Searching…
						</div>
					) : filtered.length === 0 ? (
						<div className="px-2 py-1.5 text-sm text-muted-foreground">
							{emptyText}
						</div>
					) : (
						filtered.map((o, i) => (
							<button
								key={o.value}
								type="button"
								data-active={i === active}
								onClick={() => choose(o.value)}
								onMouseMove={() => setActive(i)}
								className={cn(
									'select-item text-start hover:bg-muted',
									i === active && 'bg-muted',
								)}
							>
								<span className="select-item-indicator">
									{o.value === value && (
										<Icon name="check" className="size-4" />
									)}
								</span>
								{o.label}
							</button>
						))
					)}
					{loadingMore && filtered.length > 0 && (
						<div className="flex items-center justify-center gap-2 px-2 py-2 text-sm text-muted-foreground">
							<Icon
								name="loader"
								className="size-4 animate-spin"
							/>
							Loading more…
						</div>
					)}
				</div>
			</PopoverContent>
		</Popover>
	)
}
