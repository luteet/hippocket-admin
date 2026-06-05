export interface Group {
	id: number
	name: string
	slug: string
}

// Lightweight group option from /refs/groups/ — note the numeric id (unlike the
// string-id `RefOption` taxonomy lists).
export interface GroupOption {
	id: number
	name: string
}
