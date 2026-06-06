import { useNavigate, useParams } from 'react-router'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { SectionTitle } from '@/components/SectionTitle'
import { useFormConfig } from '../hooks'
import { FormConfigForm } from './FormConfigForm'
import { RelatedGroupPrices } from './components/RelatedGroupPrices'

export function FormConfigEditPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: item, isLoading } = useFormConfig(id)
	const back = () => navigate('/form-configs')

	return (
		<div>
			<PageHeader
				title="Edit form"
				actions={
					<Button variant="outline" onClick={back} aria-label="Back">
						<Icon name="arrow-left" />
						<span className="sm:inline hidden">Back</span>
					</Button>
				}
			/>
			<Card className="max-w-2xl">
				<CardContent className="space-y-6 pt-6">
					{isLoading || !item ? (
						<div className="space-y-3">
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-12 w-2/3" />
						</div>
					) : (
						<>
							<FormConfigForm
								item={item}
								onSuccess={back}
								onCancel={back}
								onDeleted={back}
							/>
							<div>
								<SectionTitle>Group prices</SectionTitle>
								<div className="pt-4">
									<RelatedGroupPrices
										prices={item.group_prices}
									/>
								</div>
							</div>
						</>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
