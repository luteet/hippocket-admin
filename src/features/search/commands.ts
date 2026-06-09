import type { IconName } from '@/components/Icon'
import { NAV_ITEMS, type NavItem } from '@/components/layout/useAppShell'

// A single searchable navigation target, flattened out of the nav tree.
export interface NavCommand {
	to: string
	label: string
	description?: string
	icon: IconName
	// Parent group label for a nested item — shown as a breadcrumb prefix.
	parentLabel?: string
	// Pre-built lowercase haystack (label + description + parent + keywords)
	// used for matching.
	haystack: string
}

// A `groupOnly` parent has no page of its own — searching it should land on the
// same place its sidebar button does (its first child).
function resolveTo(item: NavItem): string {
	if (item.groupOnly) return item.children?.[0]?.to ?? item.to
	return item.to
}

function toCommand(item: NavItem, parentLabel?: string): NavCommand {
	const haystack = [
		item.label,
		item.description,
		parentLabel,
		...(item.keywords ?? []),
	]
		.filter(Boolean)
		.join(' ')
		.toLowerCase()
	return {
		to: resolveTo(item),
		label: item.label,
		description: item.description,
		icon: item.icon,
		parentLabel,
		haystack,
	}
}

// Flatten the nav tree (parents + children) into one searchable list, deduped by
// destination so a `groupOnly` parent and its identical first child don't both
// show up. The parent comes first, so its broader keywords/description win.
export const NAV_COMMANDS: NavCommand[] = (() => {
	const flat = NAV_ITEMS.flatMap((item) => [
		toCommand(item),
		...(item.children ?? []).map((child) => toCommand(child, item.label)),
	])
	const seen = new Set<string>()
	return flat.filter((c) => {
		if (seen.has(c.to)) return false
		seen.add(c.to)
		return true
	})
})()

// Score a command against a query. Returns null when it doesn't match at all
// (so the caller can drop it), or a relevance number where higher is better.
export function scoreCommand(cmd: NavCommand, query: string): number | null {
	const q = query.trim().toLowerCase()
	if (!q) return 0
	// Every whitespace-separated token must appear somewhere in the haystack.
	const tokens = q.split(/\s+/)
	if (!tokens.every((t) => cmd.haystack.includes(t))) return null

	const label = cmd.label.toLowerCase()
	if (label === q) return 100
	if (label.startsWith(q)) return 80
	if (label.includes(q)) return 60
	// Matched only via description / keywords / parent label.
	return 40
}
