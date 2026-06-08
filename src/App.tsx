import { BrowserRouter } from 'react-router'
import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from '@/lib/queryClient'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/features/auth/AuthContext'
import { Pages } from '@/Pages'
import { useVersionCheck } from '@/hooks/useVersionCheck'

export default function App() {
	useVersionCheck()

	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<AuthProvider>
					<Pages />
				</AuthProvider>
			</BrowserRouter>
			<Toaster position="top-right" richColors />
		</QueryClientProvider>
	)
}
