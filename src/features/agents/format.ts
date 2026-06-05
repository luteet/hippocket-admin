import type { Agent } from '@/types/api'

export { formatDateTime } from '@/lib/format'

/** "First Last" — empty string when no name is set. */
export function fullName(first: string, last: string) {
	return `${first} ${last}`.trim()
}

/** Display name of the agent's chosen (primary) group, via the parallel
 * group_ids/group_names arrays; falls back to the slug. */
export function chosenGroupName(agent: Agent): string {
	if (agent.chosen_group_id == null) return ''
	const idx = agent.group_ids.indexOf(agent.chosen_group_id)
	if (idx >= 0 && agent.group_names[idx]) return agent.group_names[idx]
	return agent.chosen_group_slug ?? ''
}
