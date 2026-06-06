import { useFilterContainer } from '@/components/list/FilterContainerContext'
import { Label } from '@/components/ui/label'
import type { AiSession } from '@/types/api'
import { ALL } from '../useMessagesPage'
import { SessionSelect } from './SessionSelect'

// The "Session" filter for the messages list, for use inside FiltersPopover.
// Wraps SessionSelect with a label and an "All sessions" reset option, and
// portals its dropdown into the popover body via the FilterContainer context.
export function SessionFilter({
	value,
	options,
	loading,
	onChange,
}: {
	value: string
	options: AiSession[]
	loading?: boolean
	onChange: (value: string) => void
}) {
	const container = useFilterContainer()
	return (
		<div className="space-y-1.5">
			<Label>Session</Label>
			<SessionSelect
				value={value}
				options={options}
				loading={loading}
				onChange={onChange}
				allOption={{ value: ALL, label: 'All sessions' }}
				container={container}
			/>
		</div>
	)
}
