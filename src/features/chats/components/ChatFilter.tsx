import { useFilterContainer } from '@/components/list/FilterContainerContext'
import { Label } from '@/components/ui/label'
import type { Chat } from '@/types/api'
import { ALL } from '../useChatMessagesPage'
import { ChatSelect } from './ChatSelect'

// The "Chat" filter for the messages list, for use inside FiltersPopover.
// Wraps ChatSelect with a label and an "All chats" reset option, and portals
// its dropdown into the popover body via the FilterContainer context.
export function ChatFilter({
	value,
	options,
	loading,
	onChange,
}: {
	value: string
	options: Chat[]
	loading?: boolean
	onChange: (value: string) => void
}) {
	const container = useFilterContainer()
	return (
		<div className="space-y-1.5">
			<Label>Chat</Label>
			<ChatSelect
				value={value}
				options={options}
				loading={loading}
				onChange={onChange}
				allOption={{ value: ALL, label: 'All chats' }}
				container={container}
			/>
		</div>
	)
}
