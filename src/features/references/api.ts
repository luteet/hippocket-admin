import { api } from '@/lib/api/client'
import type { RefOption } from '@/types/api'

// The reference-data (selects) endpoints all return a flat `[{ id, name }]`
// list with no pagination — see the "Reference data (selects)" folder in the
// Postman collection. One fetcher serves every kind; the caller passes the path.
export async function listReferenceOptions(
	endpoint: string,
): Promise<RefOption[]> {
	const { data } = await api.get<RefOption[]>(endpoint)
	return data
}
