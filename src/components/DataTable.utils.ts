/**
 * Page indices to render, with `'ellipsis'` gaps. Always shows the first and
 * last page plus a window around the current one (e.g. 1 … 4 5 6 … 20).
 */
export function getPageItems(
	current: number,
	pageCount: number,
): (number | 'ellipsis')[] {
	const pages = new Set<number>([0, pageCount - 1])
	for (let i = current - 1; i <= current + 1; i++) {
		if (i >= 0 && i < pageCount) pages.add(i)
	}
	const sorted = [...pages].sort((a, b) => a - b)
	const items: (number | 'ellipsis')[] = []
	let prev = -1
	for (const p of sorted) {
		if (prev !== -1 && p - prev > 1) items.push('ellipsis')
		items.push(p)
		prev = p
	}
	return items
}
