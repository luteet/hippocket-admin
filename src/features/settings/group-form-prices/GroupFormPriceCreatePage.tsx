import { useNavigate } from 'react-router'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { GroupFormPriceForm } from './GroupFormPriceForm'

export function GroupFormPriceCreatePage() {
	const navigate = useNavigate()
	const back = () => navigate('/group-form-prices')

	return (
		<div>
			<PageHeader
				title="New form price"
				actions={
					<Button variant="outline" onClick={back} aria-label="Back">
						<Icon name="arrow-left" />
						<span className="sm:inline hidden">Back</span>
					</Button>
				}
			/>
			<Card className="max-w-2xl">
				<CardContent className="pt-6">
					<GroupFormPriceForm
						onSuccess={back}
						onCancel={back}
						onDeleted={back}
					/>
				</CardContent>
			</Card>
		</div>
	)
}
