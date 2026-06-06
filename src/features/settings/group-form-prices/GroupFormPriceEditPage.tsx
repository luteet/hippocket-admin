import { useNavigate, useParams } from 'react-router'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useGroupFormPrice } from '../hooks'
import { GroupFormPriceForm } from './GroupFormPriceForm'

export function GroupFormPriceEditPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: item, isLoading } = useGroupFormPrice(id)
	const back = () => navigate('/group-form-prices')

	return (
		<div>
			<PageHeader
				title="Edit form price"
				actions={
					<Button variant="outline" onClick={back} aria-label="Back">
						<Icon name="arrow-left" />
						<span className="sm:inline hidden">Back</span>
					</Button>
				}
			/>
			<Card className="max-w-2xl">
				<CardContent className="pt-6">
					{isLoading || !item ? (
						<div className="space-y-3">
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-12 w-2/3" />
						</div>
					) : (
						<GroupFormPriceForm
							item={item}
							onSuccess={back}
							onCancel={back}
							onDeleted={back}
						/>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
