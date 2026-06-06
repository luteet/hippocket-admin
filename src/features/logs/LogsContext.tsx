import { createContext, useContext, type ReactNode } from 'react'

import { useLogsPage, type LogSlug } from './useLogsPage'

// The whole page hook's return value, shared so the page and its toolbar
// (LogsFilters) read the same state without prop-drilling.
type LogsContextValue = ReturnType<typeof useLogsPage>

const LogsContext = createContext<LogsContextValue | null>(null)

export function LogsProvider({
	slug,
	children,
}: {
	slug: LogSlug
	children: ReactNode
}) {
	const value = useLogsPage(slug)
	return <LogsContext value={value}>{children}</LogsContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLogsContext() {
	const ctx = useContext(LogsContext)
	if (!ctx) throw new Error('useLogsContext must be used within LogsProvider')
	return ctx
}
