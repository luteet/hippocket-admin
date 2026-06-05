import { useNavigate } from 'react-router'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { GroupForm } from './GroupForm'

export function GroupCreatePage() {
	const navigate = useNavigate()

	return (
		<div>
			<PageHeader
				title="New group"
				actions={
					<Button
						variant="outline"
						onClick={() => navigate('/groups')}
						aria-label="Back"
					>
						<Icon name="arrow-left" />
						<span className="sm:inline hidden">Back</span>
					</Button>
				}
			/>
			<Card className="max-w-2xl">
				<CardContent className="pt-6">
					<GroupForm
						onSuccess={(g) => navigate(`/groups/${g.id}`)}
						onCancel={() => navigate('/groups')}
					/>
				</CardContent>
			</Card>
		</div>
	)
}
