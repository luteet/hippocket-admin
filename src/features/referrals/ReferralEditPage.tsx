import { useNavigate, useParams } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { useReferral } from './hooks'
import { ReferralForm } from './ReferralForm'

export function ReferralEditPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: referral, isLoading } = useReferral(id)

	return (
		<FormPage
			title="Edit referral"
			onBack={() => navigate(`/referrals/${id}`)}
			isLoading={isLoading}
			ready={Boolean(referral)}
		>
			<ReferralForm
				referral={referral}
				onSuccess={(r) => navigate(`/referrals/${r.id}`)}
				onCancel={() => navigate(`/referrals/${id}`)}
			/>
		</FormPage>
	)
}
