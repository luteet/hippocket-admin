import { useNavigate } from 'react-router'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SessionForm } from './SessionForm'

export function SessionCreatePage() {
	const navigate = useNavigate()

	return (
		<div>
			<Reveal index={0}>
				<PageHeader
					title="New session"
					actions={
						<Button
							variant="outline"
							onClick={() => navigate('/ai-chat/sessions')}
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
						<SessionForm
							onSuccess={(s) =>
								navigate(`/ai-chat/sessions/${s.id}`)
							}
							onCancel={() => navigate('/ai-chat/sessions')}
						/>
					</Reveal>
				</CardContent>
			</Card>
		</div>
	)
}
