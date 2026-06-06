import { useNavigate, useParams } from 'react-router'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useWithdrawal } from './hooks'
import { WithdrawalForm } from './WithdrawalForm'

export function WithdrawalEditPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: withdrawal, isLoading } = useWithdrawal(id)

	return (
		<div>
			<Reveal index={0}>
				<PageHeader
					title="Edit withdrawal"
					actions={
						<Button
							variant="outline"
							onClick={() => navigate(`/withdrawals/${id}`)}
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
					{isLoading ? (
						<div className="space-y-3">
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-12 w-2/3" />
						</div>
					) : !withdrawal ? (
						<p className="text-muted-foreground">
							Withdrawal not found
						</p>
					) : (
						<Reveal index={1}>
							<WithdrawalForm
								withdrawal={withdrawal}
								onSuccess={(w) =>
									navigate(`/withdrawals/${w.id}`)
								}
								onCancel={() => navigate(`/withdrawals/${id}`)}
							/>
						</Reveal>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
