import { useState } from 'react'
import { toast } from 'sonner'

/** How many per-item requests to have in flight at once. */
const CHUNK_SIZE = 8

/**
 * Run `op` over `items` in chunks so a large selection doesn't fire every
 * request at once. Order is preserved, so the returned settled results line up
 * with `items` by index.
 */
async function runChunked<T>(
	items: T[],
	op: (item: T) => Promise<unknown>,
): Promise<PromiseSettledResult<unknown>[]> {
	const results: PromiseSettledResult<unknown>[] = []
	for (let i = 0; i < items.length; i += CHUNK_SIZE) {
		const chunk = items.slice(i, i + CHUNK_SIZE)
		results.push(...(await Promise.allSettled(chunk.map(op))))
	}
	return results
}

/**
 * Client-side fan-out executor for bulk actions. There are no batch endpoints,
 * so a bulk op is N single per-record calls run with `Promise.allSettled` — it
 * is therefore **not atomic**: partial failure is possible and is surfaced in a
 * toast ("Approved 8, failed 2"). The settled results map to `items` by index,
 * so `run` returns the items that failed; the caller keeps those selected (and
 * invalidates its query) in the `onDone` callback so the user can retry just
 * the stragglers.
 *
 * `verb` is the past-tense label for the toast (e.g. `'Deleted'`, `'Approved'`,
 * `'Marked paid'`).
 */
export function useBulkAction<T>() {
	const [isRunning, setIsRunning] = useState(false)

	const run = async (
		items: T[],
		op: (item: T) => Promise<unknown>,
		opts: { verb: string; onDone?: (failed: T[]) => void },
	): Promise<T[]> => {
		setIsRunning(true)
		try {
			const results = await runChunked(items, op)
			const failed = items.filter(
				(_, i) => results[i].status === 'rejected',
			)
			const ok = items.length - failed.length
			if (failed.length === 0) {
				toast.success(`${opts.verb} ${ok} item${ok === 1 ? '' : 's'}`)
			} else {
				toast.error(`${opts.verb} ${ok}, failed ${failed.length}`)
			}
			opts.onDone?.(failed)
			return failed
		} finally {
			setIsRunning(false)
		}
	}

	return { run, isRunning }
}
