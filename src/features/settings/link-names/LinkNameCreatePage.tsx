import { useNavigate } from 'react-router'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { LinkNameForm } from './LinkNameForm'

export function LinkNameCreatePage() {
	const navigate = useNavigate()
	const back = () => navigate('/link-names')

	return (
		<div>
			<Reveal index={0}>
				<PageHeader
					title="New link"
					actions={
						<Button
							variant="outline"
							onClick={back}
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
					<Reveal index={1}>
						<LinkNameForm
							onSuccess={back}
							onCancel={back}
							onDeleted={back}
						/>
					</Reveal>
				</CardContent>
			</Card>
		</div>
	)
}
