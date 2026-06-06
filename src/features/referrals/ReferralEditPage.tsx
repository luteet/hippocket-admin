import { useNavigate, useParams } from 'react-router'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useReferral } from './hooks'
import { ReferralForm } from './ReferralForm'

export function ReferralEditPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: referral, isLoading } = useReferral(id)

	return (
		<div>
			<Reveal index={0}>
				<PageHeader
					title="Edit referral"
					actions={
						<Button
							variant="outline"
							onClick={() => navigate(`/referrals/${id}`)}
							aria-label="Back"
						>
							<Icon name="arrow-left" />
							<span className="sm:inline hidden">Back</span>
						</Button>
					}
				/>
			</Reveal>
			<Card className="max-w-2xl">
				<CardContent className="pt-6">
					{isLoading || !referral ? (
						<div className="space-y-3">
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-12 w-2/3" />
						</div>
					) : (
						<Reveal index={1}>
							<ReferralForm
								referral={referral}
								onSuccess={(r) =>
									navigate(`/referrals/${r.id}`)
								}
								onCancel={() => navigate(`/referrals/${id}`)}
							/>
						</Reveal>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
