import { Badge } from '@/components/ui/badge'
import { DetailPage } from '@/components/detail/DetailPage'
import { useMessageDetailPage } from './useMessageDetailPage'
import { formatDateTime } from './format'
import { RoleBadge } from './components/RoleBadge'

export function MessageDetailPage() {
	const {
		message,
		isLoading,
		isDeleting,
		handleDelete,
		goBack,
		goToEdit,
		goToSession,
	} = useMessageDetailPage()

	return (
		<DetailPage
			title="AI Chat Message"
			onBack={goBack}
			ready={Boolean(message)}
			isLoading={isLoading}
			onEdit={goToEdit}
			onDelete={handleDelete}
			deleteTitle="Delete message?"
			deleteDescription="This message will be permanently deleted."
			isDeleting={isDeleting}
			header={
				message && (
					<div className="flex items-center justify-between gap-4">
						<RoleBadge role={message.role} />
						{message.is_visible ? (
							<Badge variant="success">Visible</Badge>
						) : (
							<Badge variant="muted">Hidden</Badge>
						)}
					</div>
				)
			}
			fields={
				message
					? [
							{
								label: 'User',
								value: message.session_user_email,
							},
							{
								label: 'Session',
								render: (
									<button
										type="button"
										onClick={goToSession}
										className="text-left text-primary underline-offset-2 hover:underline"
									>
										Open session
									</button>
								),
							},
							{
								label: 'Function name',
								value: message.function_name,
							},
							{
								label: 'Function call ID',
								value: message.function_call_id,
							},
							{
								label: 'Created',
								value: formatDateTime(message.created_at),
							},
							{ label: 'Message ID', value: message.id },
						]
					: undefined
			}
		>
			{message && (
				<>
					<div>
						<p className="text-xs text-muted-foreground">Content</p>
						<pre className="mt-2 max-h-96 overflow-auto rounded-md border border-border bg-muted/40 p-3 text-sm whitespace-pre-wrap wrap-break-word font-sans">
							{message.content || '—'}
						</pre>
					</div>

					{message.data != null && (
						<div>
							<p className="text-xs text-muted-foreground">
								Data
							</p>
							<pre className="mt-2 max-h-96 overflow-auto rounded-md border border-border bg-muted/40 p-3 text-xs whitespace-pre-wrap wrap-break-word">
								{JSON.stringify(message.data, null, 2)}
							</pre>
						</div>
					)}
				</>
			)}
		</DetailPage>
	)
}
