import { useEffect } from 'react'
import { useBlocker, type Blocker } from 'react-router'

/**
 * Guards against losing unsaved edits while `when` is true. Covers two exits:
 *
 * - **Tab close / reload / external link** → a native `beforeunload` prompt
 *   (its text can't be customised in modern browsers — that's expected).
 * - **In-app navigation** (router link, footer Cancel, browser Back) → returns
 *   React Router's `blocker`; the caller renders a confirm dialog while
 *   `blocker.state === 'blocked'` and resolves it with `blocker.proceed()` /
 *   `blocker.reset()`.
 *
 * `useBlocker` requires a data router — the app provides one via
 * `RouterProvider` in `App.tsx`.
 */
export function useUnsavedChangesGuard(when: boolean): Blocker {
	useEffect(() => {
		if (!when) return
		const handler = (e: BeforeUnloadEvent) => {
			e.preventDefault()
			// Legacy assignment some browsers still require to show the prompt.
			e.returnValue = ''
		}
		window.addEventListener('beforeunload', handler)
		return () => window.removeEventListener('beforeunload', handler)
	}, [when])

	return useBlocker(
		({ currentLocation, nextLocation }) =>
			when && currentLocation.pathname !== nextLocation.pathname,
	)
}
