import { useNavigate } from 'react-router'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { WithdrawalForm } from './WithdrawalForm'

export function WithdrawalCreatePage() {
	const navigate = useNavigate()

	return (
		<div>
			<PageHeader
				title="New withdrawal"
				actions={
					<Button
						variant="outline"
						onClick={() => navigate('/withdrawals')}
						aria-label="Back"
					>
						<Icon name="arrow-left" />
						<span className="sm:inline hidden">Back</span>
					</Button>
				}
			/>
			<Card className="max-w-2xl">
				<CardContent className="pt-6">
					<WithdrawalForm
						onSuccess={(w) => navigate(`/withdrawals/${w.id}`)}
						onCancel={() => navigate('/withdrawals')}
					/>
				</CardContent>
			</Card>
		</div>
	)
}
