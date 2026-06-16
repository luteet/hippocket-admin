// Audit-log types — mirror the "Audit Logs (read-only)" folder in the Postman
// collection (GET /logs/ and GET /logs/meta/). These records are read-only:
// there is no create/update/detail endpoint, so there is no DTO here.

export interface AdminLogItem {
	id: number
	event: string
	send_status: string | null
	user_email: string | null
	target_user_id: number | null
	old_email: string | null
	new_email: string | null
	description: string | null
	user_admin_url: string | null
	// SMS delivery (mainly populated for `event: "referral_sent"`, since a
	// referral is also sent to the partner by SMS). `sms_status` is `null` when
	// no SMS was attempted (partner has SMS off or no number); the error fields
	// are populated only for the `undelivered` / `failed` statuses.
	sms_status: string | null
	sms_sid: string | null
	sms_error_code: string | null
	sms_error_message: string | null
	created_at: string
}

export interface LogListData {
	items: AdminLogItem[]
	total: number
	offset: number
	count: number
}

// GET /logs/meta/ — the allowed values for the `event` / `send_status` filters,
// used to populate the filter selects.
export interface LogsMeta {
	events: string[]
	send_statuses: string[]
}
