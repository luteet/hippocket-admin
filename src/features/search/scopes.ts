import type { IconName } from '@/components/Icon'
import { listAgents } from '@/features/agents/api'
import { fullName } from '@/features/agents/format'
import { listContacts } from '@/features/contacts/api'
import { listGroups } from '@/features/groups/api'
import { listPartners } from '@/features/partners/api'
import { listPayments } from '@/features/payments/api'
import { listProperties } from '@/features/properties/api'
import { listReferrals } from '@/features/referrals/api'
import { listWithdrawals } from '@/features/withdrawals/api'

// How many records each scoped search surfaces.
const LIMIT = 7

// A single result inside an entity scope, normalised to a common shape so the
// palette can render any entity the same way and navigate to its detail page.
export interface EntityResult {
	id: string
	title: string
	subtitle?: string
	to: string
}

// An "entity scope" is a searchable record type the palette can dive into: pick
// it and the input live-searches that entity (typing a name jumps straight to
// the detail page). Adding a new searchable entity = one entry in SCOPES below.
export interface EntityScope {
	key: string
	// Plural label, e.g. "Partners".
	label: string
	// Singular, lower-case noun for prose ("Search for a partner…").
	singular: string
	icon: IconName
	// Words that surface this scope's "Search …" entry in the default list.
	keywords: string[]
	// Run the live search and map the rows to {@link EntityResult}s.
	search: (query: string) => Promise<EntityResult[]>
}

export const SCOPES: EntityScope[] = [
	{
		key: 'agents',
		label: 'Agents',
		singular: 'agent',
		icon: 'users',
		keywords: ['agent', 'agents', 'user', 'users', 'people', 'staff'],
		search: async (q) => {
			const { items } = await listAgents({
				offset: 0,
				count: LIMIT,
				search: q,
			})
			return items.map((a) => {
				const name = fullName(a.first_name, a.last_name)
				return {
					id: a.id,
					title: name || a.email,
					subtitle: name ? a.email : undefined,
					to: `/agents/${a.id}`,
				}
			})
		},
	},
	{
		key: 'partners',
		label: 'Partners',
		singular: 'partner',
		icon: 'building-2',
		keywords: ['partner', 'partners', 'business', 'vendor', 'merchant'],
		search: async (q) => {
			const { items } = await listPartners({
				offset: 0,
				count: LIMIT,
				search: q,
			})
			return items.map((p) => ({
				id: p.id,
				title: p.name,
				subtitle: p.email || p.category_name || undefined,
				to: `/partners/${p.id}`,
			}))
		},
	},
	{
		key: 'properties',
		label: 'Properties',
		singular: 'property',
		icon: 'house',
		keywords: ['property', 'properties', 'listing', 'house', 'address'],
		search: async (q) => {
			const { items } = await listProperties({
				offset: 0,
				count: LIMIT,
				search: q,
			})
			return items.map((p) => ({
				id: p.id,
				title: p.address || '(no address)',
				subtitle: p.user_email || undefined,
				to: `/properties/${p.id}`,
			}))
		},
	},
	{
		key: 'contacts',
		label: 'Contacts',
		singular: 'contact',
		icon: 'contact',
		keywords: ['contact', 'contacts', 'lead', 'inquiry'],
		search: async (q) => {
			const { items } = await listContacts({
				offset: 0,
				count: LIMIT,
				search: q,
			})
			return items.map((c) => {
				const name = `${c.first_name} ${c.last_name}`.trim()
				return {
					id: c.id,
					title: name || c.email,
					subtitle: name ? c.email : undefined,
					to: `/contacts/${c.id}`,
				}
			})
		},
	},
	{
		key: 'referrals',
		label: 'Referrals',
		singular: 'referral',
		icon: 'git-branch',
		keywords: ['referral', 'referrals', 'deal', 'pipeline'],
		search: async (q) => {
			const { items } = await listReferrals({
				offset: 0,
				count: LIMIT,
				search: q,
			})
			return items.map((r) => ({
				id: r.id,
				title: r.referral_name,
				subtitle: r.partner_name || r.agent_email || undefined,
				to: `/referrals/${r.id}`,
			}))
		},
	},
	{
		key: 'groups',
		label: 'Groups',
		singular: 'group',
		icon: 'boxes',
		keywords: ['group', 'groups', 'team'],
		search: async (q) => {
			const { items } = await listGroups({
				offset: 0,
				count: LIMIT,
				search: q,
			})
			return items.map((g) => ({
				id: String(g.id),
				title: g.name,
				to: `/groups/${g.id}`,
			}))
		},
	},
	{
		key: 'withdrawals',
		label: 'Withdrawals',
		singular: 'withdrawal',
		icon: 'wallet',
		keywords: ['withdrawal', 'withdrawals', 'payout', 'cashout'],
		search: async (q) => {
			const { items } = await listWithdrawals({
				offset: 0,
				count: LIMIT,
				search: q,
			})
			return items.map((w) => ({
				id: w.id,
				title: w.user_full_name || w.user_email,
				subtitle: w.user_full_name ? w.user_email : undefined,
				to: `/withdrawals/${w.id}`,
			}))
		},
	},
	{
		key: 'payments',
		label: 'Payments',
		singular: 'payment',
		icon: 'badge-dollar',
		keywords: ['payment', 'payments', 'transaction', 'billing'],
		search: async (q) => {
			const { items } = await listPayments({
				offset: 0,
				count: LIMIT,
				search: q,
			})
			return items.map((p) => ({
				id: p.id,
				title: p.referral_name || p.user_email,
				subtitle: p.referral_name ? p.user_email : undefined,
				to: `/payments/${p.id}`,
			}))
		},
	},
]

// Find the scopes whose label/keywords the query hints at — used to offer
// "Search <Entity>" shortcuts in the default result list. Prefix-based so a
// single stray letter doesn't surface every scope.
export function matchingScopes(query: string): EntityScope[] {
	const q = query.trim().toLowerCase()
	if (!q) return []
	return SCOPES.filter(
		(s) =>
			s.label.toLowerCase().startsWith(q) ||
			s.keywords.some((k) => k.startsWith(q) || q.startsWith(k)),
	)
}
