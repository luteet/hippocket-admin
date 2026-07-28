import { Fragment, lazy, type ComponentType } from 'react'
import { Route, Routes, type Location } from 'react-router'

import { AppShell } from '@/components/layout/AppShell'
import { NotFound } from '@/components/layout/NotFound'

// Lazy-loaded pages — each becomes its own chunk (code-splitting). LoginPage is
// imported eagerly (in Pages.tsx) so the auth boundary can cross-fade without a
// Suspense fallback flashing mid-transition; it's the entry screen, so it'd load
// up-front anyway.
//
// `lazyNamed` adapts our named exports to the default export lazy() expects, in
// one line instead of a four-line `.then` per page. The `import('…')` string
// stays a literal argument so Vite can still statically analyse it and split
// each page into its own chunk; the component's prop type is preserved through
// the generic, so e.g. `<ReferenceListPage kind={…} />` stays type-checked.
function lazyNamed<P, K extends string>(
	loader: () => Promise<{ [key in K]: ComponentType<P> }>,
	name: K,
) {
	return lazy(() => loader().then((m) => ({ default: m[name] })))
}

const PartnersPage = lazyNamed(
	() => import('@/features/partners/PartnersPage'),
	'PartnersPage',
)
const PartnerCreatePage = lazyNamed(
	() => import('@/features/partners/PartnerCreatePage'),
	'PartnerCreatePage',
)
const PartnerDetailPage = lazyNamed(
	() => import('@/features/partners/PartnerDetailPage'),
	'PartnerDetailPage',
)
const PartnerEditPage = lazyNamed(
	() => import('@/features/partners/PartnerEditPage'),
	'PartnerEditPage',
)
const PropertiesPage = lazyNamed(
	() => import('@/features/properties/PropertiesPage'),
	'PropertiesPage',
)
const PropertyCreatePage = lazyNamed(
	() => import('@/features/properties/PropertyCreatePage'),
	'PropertyCreatePage',
)
const PropertyDetailPage = lazyNamed(
	() => import('@/features/properties/PropertyDetailPage'),
	'PropertyDetailPage',
)
const PropertyEditPage = lazyNamed(
	() => import('@/features/properties/PropertyEditPage'),
	'PropertyEditPage',
)
const PropertyImagesPage = lazyNamed(
	() => import('@/features/property-images/PropertyImagesPage'),
	'PropertyImagesPage',
)
const PropertyImageDetailPage = lazyNamed(
	() => import('@/features/property-images/PropertyImageDetailPage'),
	'PropertyImageDetailPage',
)
const PropertyImageEditPage = lazyNamed(
	() => import('@/features/property-images/PropertyImageEditPage'),
	'PropertyImageEditPage',
)
const CashOffersEmailsPage = lazyNamed(
	() => import('@/features/cash-offers-emails/CashOffersEmailsPage'),
	'CashOffersEmailsPage',
)
const CashOffersEmailCreatePage = lazyNamed(
	() => import('@/features/cash-offers-emails/CashOffersEmailCreatePage'),
	'CashOffersEmailCreatePage',
)
const CashOffersEmailDetailPage = lazyNamed(
	() => import('@/features/cash-offers-emails/CashOffersEmailDetailPage'),
	'CashOffersEmailDetailPage',
)
const CashOffersEmailEditPage = lazyNamed(
	() => import('@/features/cash-offers-emails/CashOffersEmailEditPage'),
	'CashOffersEmailEditPage',
)
const ContactsPage = lazyNamed(
	() => import('@/features/contacts/ContactsPage'),
	'ContactsPage',
)
const ContactCreatePage = lazyNamed(
	() => import('@/features/contacts/ContactCreatePage'),
	'ContactCreatePage',
)
const ContactDetailPage = lazyNamed(
	() => import('@/features/contacts/ContactDetailPage'),
	'ContactDetailPage',
)
const ContactEditPage = lazyNamed(
	() => import('@/features/contacts/ContactEditPage'),
	'ContactEditPage',
)
const ReferralsPage = lazyNamed(
	() => import('@/features/referrals/ReferralsPage'),
	'ReferralsPage',
)
const ReferralDetailPage = lazyNamed(
	() => import('@/features/referrals/ReferralDetailPage'),
	'ReferralDetailPage',
)
const ReferralEditPage = lazyNamed(
	() => import('@/features/referrals/ReferralEditPage'),
	'ReferralEditPage',
)
const ReferralExportPage = lazyNamed(
	() => import('@/features/referrals/ReferralExportPage'),
	'ReferralExportPage',
)
const AgentsPage = lazyNamed(
	() => import('@/features/agents/AgentsPage'),
	'AgentsPage',
)
const AgentDetailPage = lazyNamed(
	() => import('@/features/agents/AgentDetailPage'),
	'AgentDetailPage',
)
const AgentCreatePage = lazyNamed(
	() => import('@/features/agents/AgentCreatePage'),
	'AgentCreatePage',
)
const AgentEditPage = lazyNamed(
	() => import('@/features/agents/AgentEditPage'),
	'AgentEditPage',
)
const SavedFiltersPage = lazyNamed(
	() => import('@/features/saved-filters/SavedFiltersPage'),
	'SavedFiltersPage',
)
const SavedFilterDetailPage = lazyNamed(
	() => import('@/features/saved-filters/SavedFilterDetailPage'),
	'SavedFilterDetailPage',
)
const SavedFilterCreatePage = lazyNamed(
	() => import('@/features/saved-filters/SavedFilterCreatePage'),
	'SavedFilterCreatePage',
)
const SavedFilterEditPage = lazyNamed(
	() => import('@/features/saved-filters/SavedFilterEditPage'),
	'SavedFilterEditPage',
)
const TeamLeadersPage = lazyNamed(
	() => import('@/features/team-leaders/TeamLeadersPage'),
	'TeamLeadersPage',
)
const TeamLeaderDetailPage = lazyNamed(
	() => import('@/features/team-leaders/TeamLeaderDetailPage'),
	'TeamLeaderDetailPage',
)
const TeamLeaderCreatePage = lazyNamed(
	() => import('@/features/team-leaders/TeamLeaderCreatePage'),
	'TeamLeaderCreatePage',
)
const TeamLeaderEditPage = lazyNamed(
	() => import('@/features/team-leaders/TeamLeaderEditPage'),
	'TeamLeaderEditPage',
)
const GroupsPage = lazyNamed(
	() => import('@/features/groups/GroupsPage'),
	'GroupsPage',
)
const GroupDetailPage = lazyNamed(
	() => import('@/features/groups/GroupDetailPage'),
	'GroupDetailPage',
)
const GroupCreatePage = lazyNamed(
	() => import('@/features/groups/GroupCreatePage'),
	'GroupCreatePage',
)
const GroupEditPage = lazyNamed(
	() => import('@/features/groups/GroupEditPage'),
	'GroupEditPage',
)
const StatusesPage = lazyNamed(
	() => import('@/features/statuses/StatusesPage'),
	'StatusesPage',
)
const StatusDetailPage = lazyNamed(
	() => import('@/features/statuses/StatusDetailPage'),
	'StatusDetailPage',
)
const StatusCreatePage = lazyNamed(
	() => import('@/features/statuses/StatusCreatePage'),
	'StatusCreatePage',
)
const StatusEditPage = lazyNamed(
	() => import('@/features/statuses/StatusEditPage'),
	'StatusEditPage',
)
const PaymentsPage = lazyNamed(
	() => import('@/features/payments/PaymentsPage'),
	'PaymentsPage',
)
const PaymentDetailPage = lazyNamed(
	() => import('@/features/payments/PaymentDetailPage'),
	'PaymentDetailPage',
)
const WithdrawalsPage = lazyNamed(
	() => import('@/features/withdrawals/WithdrawalsPage'),
	'WithdrawalsPage',
)
const WithdrawalDetailPage = lazyNamed(
	() => import('@/features/withdrawals/WithdrawalDetailPage'),
	'WithdrawalDetailPage',
)
const WithdrawalCreatePage = lazyNamed(
	() => import('@/features/withdrawals/WithdrawalCreatePage'),
	'WithdrawalCreatePage',
)
const WithdrawalEditPage = lazyNamed(
	() => import('@/features/withdrawals/WithdrawalEditPage'),
	'WithdrawalEditPage',
)
const MessagesPage = lazyNamed(
	() => import('@/features/aichat/MessagesPage'),
	'MessagesPage',
)
const MessageDetailPage = lazyNamed(
	() => import('@/features/aichat/MessageDetailPage'),
	'MessageDetailPage',
)
const MessageCreatePage = lazyNamed(
	() => import('@/features/aichat/MessageCreatePage'),
	'MessageCreatePage',
)
const MessageEditPage = lazyNamed(
	() => import('@/features/aichat/MessageEditPage'),
	'MessageEditPage',
)
const SessionsPage = lazyNamed(
	() => import('@/features/aichat/SessionsPage'),
	'SessionsPage',
)
const SessionDetailPage = lazyNamed(
	() => import('@/features/aichat/SessionDetailPage'),
	'SessionDetailPage',
)
const SessionCreatePage = lazyNamed(
	() => import('@/features/aichat/SessionCreatePage'),
	'SessionCreatePage',
)
const ChatsPage = lazyNamed(
	() => import('@/features/chats/ChatsPage'),
	'ChatsPage',
)
const ChatCreatePage = lazyNamed(
	() => import('@/features/chats/ChatCreatePage'),
	'ChatCreatePage',
)
const ChatDetailPage = lazyNamed(
	() => import('@/features/chats/ChatDetailPage'),
	'ChatDetailPage',
)
const ChatEditPage = lazyNamed(
	() => import('@/features/chats/ChatEditPage'),
	'ChatEditPage',
)
const ChatMessagesPage = lazyNamed(
	() => import('@/features/chats/ChatMessagesPage'),
	'ChatMessagesPage',
)
const ChatMessageDetailPage = lazyNamed(
	() => import('@/features/chats/ChatMessageDetailPage'),
	'ChatMessageDetailPage',
)
const ChatMessageCreatePage = lazyNamed(
	() => import('@/features/chats/ChatMessageCreatePage'),
	'ChatMessageCreatePage',
)
const ChatMessageEditPage = lazyNamed(
	() => import('@/features/chats/ChatMessageEditPage'),
	'ChatMessageEditPage',
)
const ChatMediaPage = lazyNamed(
	() => import('@/features/chats/ChatMediaPage'),
	'ChatMediaPage',
)
const ChatMediaDetailPage = lazyNamed(
	() => import('@/features/chats/ChatMediaDetailPage'),
	'ChatMediaDetailPage',
)
const SharedPartnersPage = lazyNamed(
	() => import('@/features/journey/SharedPartnersPage'),
	'SharedPartnersPage',
)
const SharedPartnerCreatePage = lazyNamed(
	() => import('@/features/journey/SharedPartnerCreatePage'),
	'SharedPartnerCreatePage',
)
const SharedPartnerDetailPage = lazyNamed(
	() => import('@/features/journey/SharedPartnerDetailPage'),
	'SharedPartnerDetailPage',
)
const SharedPartnerEditPage = lazyNamed(
	() => import('@/features/journey/SharedPartnerEditPage'),
	'SharedPartnerEditPage',
)
const PartnerConnectPage = lazyNamed(
	() => import('@/features/partner-connect/PartnerConnectPage'),
	'PartnerConnectPage',
)
const PartnerConnectCreatePage = lazyNamed(
	() => import('@/features/partner-connect/PartnerConnectCreatePage'),
	'PartnerConnectCreatePage',
)
const PartnerConnectDetailPage = lazyNamed(
	() => import('@/features/partner-connect/PartnerConnectDetailPage'),
	'PartnerConnectDetailPage',
)
const PartnerConnectEditPage = lazyNamed(
	() => import('@/features/partner-connect/PartnerConnectEditPage'),
	'PartnerConnectEditPage',
)
// One parameterized page serves the three read-only audit-log sections; the
// `slug` prop selects the labels and which `event` (if any) is pinned.
const LogsPage = lazyNamed(() => import('@/features/logs/LogsPage'), 'LogsPage')

// System (base): a read-only dashboard, the General settings singleton, and four
// list-CRUD resources (no detail page — rows open straight into Edit).
const DashboardPage = lazyNamed(
	() => import('@/features/settings/dashboard/DashboardPage'),
	'DashboardPage',
)
const GeneralSettingsPage = lazyNamed(
	() => import('@/features/settings/general/GeneralSettingsPage'),
	'GeneralSettingsPage',
)
const TokenCoursesPage = lazyNamed(
	() => import('@/features/settings/token-courses/TokenCoursesPage'),
	'TokenCoursesPage',
)
const TokenCourseCreatePage = lazyNamed(
	() => import('@/features/settings/token-courses/TokenCourseCreatePage'),
	'TokenCourseCreatePage',
)
const TokenCourseEditPage = lazyNamed(
	() => import('@/features/settings/token-courses/TokenCourseEditPage'),
	'TokenCourseEditPage',
)
const LinkNamesPage = lazyNamed(
	() => import('@/features/settings/link-names/LinkNamesPage'),
	'LinkNamesPage',
)
const LinkNameCreatePage = lazyNamed(
	() => import('@/features/settings/link-names/LinkNameCreatePage'),
	'LinkNameCreatePage',
)
const LinkNameEditPage = lazyNamed(
	() => import('@/features/settings/link-names/LinkNameEditPage'),
	'LinkNameEditPage',
)
const FormConfigsPage = lazyNamed(
	() => import('@/features/settings/form-configs/FormConfigsPage'),
	'FormConfigsPage',
)
const FormConfigCreatePage = lazyNamed(
	() => import('@/features/settings/form-configs/FormConfigCreatePage'),
	'FormConfigCreatePage',
)
const FormConfigEditPage = lazyNamed(
	() => import('@/features/settings/form-configs/FormConfigEditPage'),
	'FormConfigEditPage',
)
const GroupFormPricesPage = lazyNamed(
	() => import('@/features/settings/group-form-prices/GroupFormPricesPage'),
	'GroupFormPricesPage',
)
const GroupFormPriceCreatePage = lazyNamed(
	() =>
		import('@/features/settings/group-form-prices/GroupFormPriceCreatePage'),
	'GroupFormPriceCreatePage',
)
const GroupFormPriceEditPage = lazyNamed(
	() =>
		import('@/features/settings/group-form-prices/GroupFormPriceEditPage'),
	'GroupFormPriceEditPage',
)

// One parameterized set of pages serves the four partner-taxonomy sections; the
// `kind` prop selects the labels and the `/catalogs/*` endpoint it reads/writes.
const ReferenceListPage = lazyNamed(
	() => import('@/features/references/ReferenceListPage'),
	'ReferenceListPage',
)
const ReferenceCreatePage = lazyNamed(
	() => import('@/features/references/ReferenceCreatePage'),
	'ReferenceCreatePage',
)
const ReferenceDetailPage = lazyNamed(
	() => import('@/features/references/ReferenceDetailPage'),
	'ReferenceDetailPage',
)
const ReferenceEditPage = lazyNamed(
	() => import('@/features/references/ReferenceEditPage'),
	'ReferenceEditPage',
)

// The `kind` doubles as the URL segment, so the four CRUD routes are identical
// per section — generate them instead of hand-listing 16 <Route>s.
const REFERENCE_KINDS = [
	'categories',
	'segments',
	'locations',
	'services',
] as const

// Every top-level section exposes the same CRUD URL shape — list / new / :id /
// :id/edit — so describe each as a config row and generate its routes instead
// of repeating the four <Route>s by hand. `Create` is optional: referrals has
// no create page, so it just omits the `/new` route.
type CrudPages = {
	List: ComponentType
	Create?: ComponentType
	Detail?: ComponentType
	Edit?: ComponentType
}

const CRUD_SECTIONS: { path: string; pages: CrudPages }[] = [
	{
		path: 'partners',
		pages: {
			List: PartnersPage,
			Create: PartnerCreatePage,
			Detail: PartnerDetailPage,
			Edit: PartnerEditPage,
		},
	},
	{
		path: 'properties',
		pages: {
			List: PropertiesPage,
			Create: PropertyCreatePage,
			Detail: PropertyDetailPage,
			Edit: PropertyEditPage,
		},
	},
	{
		// Nested under Properties in the nav.
		path: 'property-images',
		pages: {
			// No create page: uploads happen in the app, not the admin.
			List: PropertyImagesPage,
			Detail: PropertyImageDetailPage,
			Edit: PropertyImageEditPage,
		},
	},
	{
		// Nested under Properties in the nav.
		path: 'cash-offers-emails',
		pages: {
			List: CashOffersEmailsPage,
			Create: CashOffersEmailCreatePage,
			Detail: CashOffersEmailDetailPage,
			Edit: CashOffersEmailEditPage,
		},
	},
	{
		path: 'contacts',
		pages: {
			List: ContactsPage,
			Create: ContactCreatePage,
			Detail: ContactDetailPage,
			Edit: ContactEditPage,
		},
	},
	{
		path: 'referrals',
		pages: {
			List: ReferralsPage,
			Detail: ReferralDetailPage,
			Edit: ReferralEditPage,
		},
	},
	{
		path: 'agents',
		pages: {
			List: AgentsPage,
			Create: AgentCreatePage,
			Detail: AgentDetailPage,
			Edit: AgentEditPage,
		},
	},
	{
		// Nested under Agents in the nav (a per-agent extra).
		path: 'saved-filters',
		pages: {
			List: SavedFiltersPage,
			Create: SavedFilterCreatePage,
			Detail: SavedFilterDetailPage,
			Edit: SavedFilterEditPage,
		},
	},
	{
		// Nested under Agents in the nav (group team leaders).
		path: 'team-leaders',
		pages: {
			List: TeamLeadersPage,
			Create: TeamLeaderCreatePage,
			Detail: TeamLeaderDetailPage,
			Edit: TeamLeaderEditPage,
		},
	},
	{
		path: 'groups',
		pages: {
			List: GroupsPage,
			Create: GroupCreatePage,
			Detail: GroupDetailPage,
			Edit: GroupEditPage,
		},
	},
	{
		path: 'statuses',
		pages: {
			List: StatusesPage,
			Create: StatusCreatePage,
			Detail: StatusDetailPage,
			Edit: StatusEditPage,
		},
	},
	{
		path: 'withdrawals',
		pages: {
			List: WithdrawalsPage,
			Create: WithdrawalCreatePage,
			Detail: WithdrawalDetailPage,
			Edit: WithdrawalEditPage,
		},
	},
	{
		// Read-only: payments can't be created, updated or deleted (mirrors the
		// Django admin). Rows open a detail page only.
		path: 'payments',
		pages: {
			List: PaymentsPage,
			Detail: PaymentDetailPage,
		},
	},
	{
		path: 'ai-chat/messages',
		pages: {
			List: MessagesPage,
			Create: MessageCreatePage,
			Detail: MessageDetailPage,
			Edit: MessageEditPage,
		},
	},
	{
		// Sessions have no update endpoint, so no Edit page.
		path: 'ai-chat/sessions',
		pages: {
			List: SessionsPage,
			Create: SessionCreatePage,
			Detail: SessionDetailPage,
		},
	},
	{
		path: 'chats',
		pages: {
			List: ChatsPage,
			Create: ChatCreatePage,
			Detail: ChatDetailPage,
			Edit: ChatEditPage,
		},
	},
	{
		path: 'chats/messages',
		pages: {
			List: ChatMessagesPage,
			Create: ChatMessageCreatePage,
			Detail: ChatMessageDetailPage,
			Edit: ChatMessageEditPage,
		},
	},
	{
		// Media is read-only + delete: no create or edit pages.
		path: 'chats/media',
		pages: {
			List: ChatMediaPage,
			Detail: ChatMediaDetailPage,
		},
	},
	{
		path: 'shared-partners',
		pages: {
			List: SharedPartnersPage,
			Create: SharedPartnerCreatePage,
			Detail: SharedPartnerDetailPage,
			Edit: SharedPartnerEditPage,
		},
	},
	{
		path: 'partner-connect',
		pages: {
			List: PartnerConnectPage,
			Create: PartnerConnectCreatePage,
			Detail: PartnerConnectDetailPage,
			Edit: PartnerConnectEditPage,
		},
	},
	// System (base) resources — no detail page: a row opens straight into Edit.
	{
		path: 'token-courses',
		pages: {
			List: TokenCoursesPage,
			Create: TokenCourseCreatePage,
			Edit: TokenCourseEditPage,
		},
	},
	{
		path: 'link-names',
		pages: {
			List: LinkNamesPage,
			Create: LinkNameCreatePage,
			Edit: LinkNameEditPage,
		},
	},
	{
		path: 'form-configs',
		pages: {
			List: FormConfigsPage,
			Create: FormConfigCreatePage,
			Edit: FormConfigEditPage,
		},
	},
	{
		path: 'group-form-prices',
		pages: {
			List: GroupFormPricesPage,
			Create: GroupFormPriceCreatePage,
			Edit: GroupFormPriceEditPage,
		},
	},
]

// The four CRUD routes for one section. Returned as a Fragment (not a component)
// because <Routes> reads route config off its direct children's props — a
// wrapper component would hide them.
function crudRoutes(path: string, { List, Create, Detail, Edit }: CrudPages) {
	return (
		<Fragment key={path}>
			<Route path={path} element={<List />} />
			{Create && <Route path={`${path}/new`} element={<Create />} />}
			{Detail && <Route path={`${path}/:id`} element={<Detail />} />}
			{Edit && <Route path={`${path}/:id/edit`} element={<Edit />} />}
		</Fragment>
	)
}

// The authenticated route tree. `location` is passed explicitly so that while
// this branch is exiting (logout), AnimatePresence keeps rendering the route
// the user was last on instead of following the URL change to the root.
export function AppRoutes({ location }: { location: Location }) {
	return (
		<Routes location={location}>
			<Route element={<AppShell />}>
				{/* Dashboard is the root page (shares the `/` path with the
				    login screen, which Pages.tsx swaps in when logged out). */}
				<Route index element={<DashboardPage />} />
				{/* General settings singleton — the Settings group's own page. */}
				<Route path="settings" element={<GeneralSettingsPage />} />
				{/* Referrals export settings page. Declared before the CRUD
				    `referrals/:id` route, though React Router ranks this static
				    path higher regardless of order. */}
				<Route
					path="referrals/export"
					element={<ReferralExportPage />}
				/>
				{CRUD_SECTIONS.map(({ path, pages }) =>
					crudRoutes(path, pages),
				)}
				{/* Audit logs: one page, three views. The "all" view sits at
				    the bare /logs path; the pinned-event views nest under it. */}
				<Route path="logs" element={<LogsPage slug="all" />} />
				<Route
					path="logs/referrals-sent"
					element={<LogsPage slug="referrals-sent" />}
				/>
				<Route
					path="logs/referrals-closed"
					element={<LogsPage slug="referrals-closed" />}
				/>
				{REFERENCE_KINDS.map((kind) => (
					<Fragment key={kind}>
						<Route
							path={kind}
							element={<ReferenceListPage kind={kind} />}
						/>
						<Route
							path={`${kind}/new`}
							element={<ReferenceCreatePage kind={kind} />}
						/>
						<Route
							path={`${kind}/:id`}
							element={<ReferenceDetailPage kind={kind} />}
						/>
						<Route
							path={`${kind}/:id/edit`}
							element={<ReferenceEditPage kind={kind} />}
						/>
					</Fragment>
				))}
				{/* Unknown path: render the 404 inside the shell. */}
				<Route path="*" element={<NotFound />} />
			</Route>
		</Routes>
	)
}
