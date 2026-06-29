import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router'

/** A set of param updates: a key is removed when its value is null/undefined/''. */
export type ParamPatch = Record<string, string | number | null | undefined>

/**
 * Read/write several URL query params at once, backed by `useSearchParams`.
 *
 * **Frozen during route transitions:** when the pathname changes (navigation
 * away, e.g. from `/referrals?status=foo` to `/referrals/123`), the returned
 * params are frozen in their last valid state so the exiting page's hooks
 * don't see empty params and flicker with stale cached data. The freeze lasts
 * until the component unmounts (exit-animation completes).
 *
 * On the same route, URL → stable-params sync happens during render to
 * support Back/Forward navigation within search params.
 *
 * `setParams` merges a patch into the current query string in a single
 * navigation (so e.g. changing the search and resetting the page happen
 * together, not as two history entries / two refetches). A patched value of
 * `null`/`undefined`/`''` deletes the key, keeping URLs clean — pass the param's
 * default that way to drop it back out of the URL.
 *
 * Writes use `{ replace: true }` by default so high-frequency updates (typing in
 * a search box) don't push a history entry per keystroke; pass
 * `{ replace: false }` for a "meaningful" navigation you want Back to return to.
 */
export function useUrlParams() {
	const [searchParams, setSearchParams] = useSearchParams()
	const location = useLocation()

	// Stable snapshot: initialised from the URL at mount, updated via setParams
	// or when the pathname is the same (Back/Forward on the same route).
	// Frozen when the pathname changes — the component is navigating away and
	// still mounted for the exit animation; freezing prevents a flicker where
	// the new route's empty query string would reset filters on the exiting page.
	const [stableParams, setStableParams] = useState(
		() => new URLSearchParams(searchParams),
	)
	const prevPathnameRef = useRef(location.pathname)

	// Set to true inside setParams so the render-phase URL→stable sync below
	// skips that render (setSearchParams hasn't updated searchParams yet).
	const ownUpdateRef = useRef(false)

	// Becomes true on the first render where the pathname changes and stays
	// true for the entire component lifetime (exit animation). This prevents
	// subsequent re-renders during exit from syncing the (now empty) URL params
	// back into stableParams. The flag resets naturally when the component
	// unmounts and a new instance mounts on the next visit.
	const isExitingRef = useRef(false)

	const setParams = useCallback(
		(patch: ParamPatch, options?: { replace?: boolean }) => {
			ownUpdateRef.current = true
			setStableParams((prev) => {
				const next = new URLSearchParams(prev)
				for (const [key, value] of Object.entries(patch)) {
					if (value == null || value === '') next.delete(key)
					else next.set(key, String(value))
				}
				return next
			})
			setSearchParams(
				(prev) => {
					const next = new URLSearchParams(prev)
					for (const [key, value] of Object.entries(patch)) {
						if (value == null || value === '') next.delete(key)
						else next.set(key, String(value))
					}
					return next
				},
				{ replace: options?.replace ?? true },
			)
		},
		[setSearchParams],
	)

	// During render: detect pathname changes and freeze / sync params.
	if (location.pathname !== prevPathnameRef.current) {
		// Route changed → the component is exiting. Keep stableParams frozen
		// in their last valid state so the exiting page's hooks don't flicker.
		prevPathnameRef.current = location.pathname
		isExitingRef.current = true
	}

	// Sync URL params back into stableParams only when:
	// 1. We're NOT in exit animation (isExitingRef is false), AND
	// 2. No pending own update (ownUpdateRef is false)
	//
	// This handles Back/Forward within the same route's search params while
	// preventing the empty URL params (from the newly navigated route) from
	// overwriting the frozen stable state during exit animation.
	if (!isExitingRef.current && !ownUpdateRef.current) {
		const urlStr = searchParams.toString()
		const stableStr = stableParams.toString()
		if (urlStr !== stableStr) {
			setStableParams(new URLSearchParams(searchParams))
		}
	}

	// Reset the own-update flag after each committed render so the next render's
	// sync can distinguish between external (Back/Forward) and own URL changes.
	useEffect(() => {
		ownUpdateRef.current = false
	})

	return [stableParams, setParams] as const
}

/**
 * A search box backed by a URL query param, with the URL write debounced.
 *
 * Typing updates the returned `value` instantly (the input stays responsive),
 * but the URL — and therefore the deep-linkable, query-driving `committed`
 * value — only catches up after `delay` ms of inactivity. This keeps a keystroke
 * from pushing a `replace` navigation (and a refetch) per character while still
 * persisting the final query in the URL. Each write also resets `page` to one.
 *
 * An external change to the param (Back/forward, or a programmatic clear via
 * `setParams`) flows back into `value`, so a "Clear filters" reset empties the
 * box immediately. Returns `[value, setValue, committed]`: bind `value`/
 * `setValue` to the input and feed `committed` to the data query.
 */
export function useUrlSearch(key = 'q', delay = 350) {
	const [params, setParams] = useUrlParams()
	const committed = params.get(key) ?? ''
	const [value, setValue] = useState(committed)

	// Adopt the URL value whenever it changes from outside our own debounced
	// write (Back/forward, a programmatic clear). Our own write lands once
	// `committed` already equals `value`, so that case is a no-op. This is the
	// "derive state from props during render" pattern (cf. DataTable's prevData).
	const [prevCommitted, setPrevCommitted] = useState(committed)
	if (committed !== prevCommitted) {
		setPrevCommitted(committed)
		if (committed !== value) setValue(committed)
	}

	// Debounce the URL write; resets the page so a new query starts at page one.
	useEffect(() => {
		if (value === committed) return
		const id = setTimeout(() => {
			setParams({ [key]: value || null, page: null })
		}, delay)
		return () => clearTimeout(id)
	}, [value, committed, key, delay, setParams])

	return [value, setValue, committed] as const
}

/**
 * A single URL param with a typed default, as a `useState`-shaped tuple. The key
 * is omitted from the URL whenever the value equals `defaultValue`. For changes
 * that must also touch other params (e.g. resetting the page), use
 * {@link useUrlParams} and patch them together instead.
 */
export function useUrlParam(key: string, defaultValue = '') {
	const [searchParams, setParams] = useUrlParams()
	const value = searchParams.get(key) ?? defaultValue
	const setValue = useCallback(
		(next: string) =>
			setParams({ [key]: next === defaultValue ? null : next }),
		[key, defaultValue, setParams],
	)
	return [value, setValue] as const
}
