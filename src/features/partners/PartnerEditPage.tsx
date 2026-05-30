import { useNavigate, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'

import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { usePartner } from './hooks'
import { PartnerForm } from './PartnerForm'

export function PartnerEditPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: partner, isLoading } = usePartner(id)

	return (
		<div>
			<PageHeader
				title="Edit partner"
				actions={
					<Button
						variant="outline"
						onClick={() => navigate(`/partners/${id}`)}
					>
						<ArrowLeft />
						Back
					</Button>
				}
			/>
			<Card className="max-w-2xl">
				<CardContent className="pt-6">
					{isLoading || !partner ? (
						<div className="space-y-3">
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-12 w-2/3" />
						</div>
					) : (
						<PartnerForm
							partner={partner}
							onSuccess={(p) => navigate(`/partners/${p.id}`)}
							onCancel={() => navigate(`/partners/${id}`)}
						/>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
