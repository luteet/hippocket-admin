// A team leader attached to a group. `group_id` is a numeric group id (not a
// UUID); `group_name` comes back resolved on read.
export interface TeamLeader {
	id: string
	group_id: number
	group_name: string
	tl_name: string
	tl_email: string
	tl_phone: string
	office_location: string
	created_at: string
}

export interface TeamLeaderData {
	count: number
	items: TeamLeader[]
	offset: number
	total: number
}

export interface CreateTeamLeaderDto {
	group_id: number
	tl_name: string
	tl_email: string
	tl_phone: string
	office_location: string
}

// Update accepts the same fields — the group can be reassigned on edit.
export type UpdateTeamLeaderDto = CreateTeamLeaderDto
