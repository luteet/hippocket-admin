// System (base) — global configuration and analytics. See the "System (base)"
// folder in the Postman collection. Shapes confirmed against the dev API.

// --- Settings (singleton) -------------------------------------------------
// GET/PUT /settings/ — one global record. `admin_email` is a ";"-separated
// list of recipient addresses.
export interface AdminSettings {
	id: string
	admin_email: string
	ai_system_prompt: string
}

export interface UpdateSettingsDto {
	admin_email: string
	ai_system_prompt: string
}

// --- Statistics (dashboard, read-only) ------------------------------------
export interface StatisticsFinancial {
	total_paid_by_partners: number
	payout_to_agents: number
	payout_to_group_owners: number
	hippocket_earnings: number
}

export interface GroupOverview {
	name: string
	users: number
	closed_referrals: number
}

export interface Statistics {
	total_users: number
	total_partners: number
	total_groups: number
	total_chat_messages: number
	total_contacts: number
	total_admin_logs: number
	total_sent_referrals: number
	total_closed_referrals: number
	financial: StatisticsFinancial
	groups_overview: GroupOverview[]
}

// --- Token Courses (/coin-courses/) ---------------------------------------
export interface TokenCourse {
	id: string
	coin_to_money: number
	created_at: string
}

export interface TokenCourseData {
	count: number
	items: TokenCourse[]
	offset: number
	total: number
}

export interface TokenCourseDto {
	coin_to_money: number
}

// --- Link Names (/link-names/) --------------------------------------------
export interface LinkName {
	id: string
	name: string
	link: string
	created_at: string
}

export interface LinkNameData {
	count: number
	items: LinkName[]
	offset: number
	total: number
}

export interface LinkNameDto {
	name: string
	link: string
}

// --- Form Configurations (/form-configs/) ---------------------------------
// The detail/list response embeds the related group prices read-only.
export interface FormConfig {
	id: string
	name: string
	slug: string
	endpoint: string
	price: number
	currency: string
	is_active: boolean
	description: string
	group_prices: GroupFormPrice[]
	created_at: string
}

export interface FormConfigData {
	count: number
	items: FormConfig[]
	offset: number
	total: number
}

export interface CreateFormConfigDto {
	name: string
	slug: string
	endpoint: string
	price: number
	currency: string
	is_active: boolean
	description: string
}

// Update can't change the slug (it's the form's identifier).
export type UpdateFormConfigDto = Omit<CreateFormConfigDto, 'slug'>

// --- Group Form Prices (/group-form-prices/) ------------------------------
export interface GroupFormPrice {
	id: string
	name: string
	group_id: number
	group_name: string
	form_config_id: string
	form_config_name: string
	price: number
	comment: string
	is_active: boolean
	created_at: string
}

export interface GroupFormPriceData {
	count: number
	items: GroupFormPrice[]
	offset: number
	total: number
}

export interface CreateGroupFormPriceDto {
	name: string
	form_config_id: string
	group_id: number
	price: number
	comment: string
	is_active: boolean
}

export type UpdateGroupFormPriceDto = CreateGroupFormPriceDto
