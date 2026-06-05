export interface StatusData {
	count: number
	items: Status[]
	offset: number
	total: number
}

export interface Status {
	id: number
	name: string
	label: string
	priority: number
}

export interface CreateStatusDto {
	name: string
	label: string
	priority: number
}

export type UpdateStatusDto = CreateStatusDto
