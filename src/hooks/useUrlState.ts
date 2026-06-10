import { useCallback } from 'react'
import { useSearchParams } from 'react-router'

/** A set of param updates: a key is removed when its value is null/undefined/''. */
export type ParamPatch = Record<string, string | number | null | undefined>

/**
 * Read/write several URL query params at once, backed by `useSearchParams`.
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

	const setParams = useCallback(
		(patch: ParamPatch, options?: { replace?: boolean }) => {
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

	return [searchParams, setParams] as const
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
