import { createBrowserRouter, RouterProvider } from 'react-router'
import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from '@/lib/queryClient'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/features/auth/AuthContext'
import { Pages } from '@/Pages'
import { useVersionCheck } from '@/hooks/useVersionCheck'

// A single splat route hosts the whole app. We keep the existing descendant
// `<Routes>` tree (in AppRoutes) and the auth cross-fade (in Pages) unchanged —
// the only reason for the data router is that `useBlocker` (the unsaved-changes
// guard in FormLayout) requires one; `<BrowserRouter>` doesn't provide it.
const router = createBrowserRouter([
	{
		path: '*',
		element: (
			<AuthProvider>
				<Pages />
			</AuthProvider>
		),
	},
])

export default function App() {
	useVersionCheck()

	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
			<Toaster position="top-right" richColors />
		</QueryClientProvider>
	)
}
