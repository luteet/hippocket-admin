import { useStatistics } from '../hooks'

export function useDashboardPage() {
	const { data, isLoading } = useStatistics()
	return { stats: data, isLoading }
}
