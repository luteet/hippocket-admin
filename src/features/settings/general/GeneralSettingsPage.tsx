import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Field } from '@/components/Field'
import { EmailTemplateUpload } from './components/EmailTemplateUpload'
import { useGeneralSettingsPage } from './useGeneralSettingsPage'

export function GeneralSettingsPage() {
	const { settings, isLoading, register, errors, isPending, onSubmit } =
		useGeneralSettingsPage()

	return (
		<div>
			<Reveal index={0}>
				<PageHeader
					title="Settings"
					description="Global admin settings"
				/>
			</Reveal>
			<Card className="max-w-2xl">
				<CardContent className="pt-6">
					{isLoading ? (
						<div className="space-y-3">
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-40 w-full" />
						</div>
					) : (
						<Reveal index={1}>
							<form onSubmit={onSubmit} className="space-y-6">
								<Field
									label="Admin emails"
									error={errors.admin_email?.message}
								>
									<Input
										placeholder="a@b.com;c@d.com"
										{...register('admin_email')}
									/>
									<p className="text-xs text-muted-foreground">
										Notification recipients, separated by
										semicolons.
									</p>
								</Field>
								<Field label="Partner email template">
									<EmailTemplateUpload
										url={settings?.email_template ?? null}
										kind="partner"
									/>
									<p className="text-xs text-muted-foreground">
										HTML file sent to partners. Uploads
										immediately on selection.
									</p>
								</Field>
								<Field label="Withdraw email template">
									<EmailTemplateUpload
										url={
											settings?.email_withdraw_template ??
											null
										}
										kind="withdraw"
									/>
									<p className="text-xs text-muted-foreground">
										HTML file sent for withdrawal requests.
										Uploads immediately on selection.
									</p>
								</Field>
								<Field
									label="AI system prompt"
									error={errors.ai_system_prompt?.message}
								>
									<Textarea
										className="min-h-40"
										{...register('ai_system_prompt')}
									/>
								</Field>
								<div className="flex justify-end pt-4">
									<Button
										type="submit"
										disabled={isPending}
										className="flex-auto xs:min-w-32 xs:flex-none"
									>
										{isPending && (
											<Icon
												name="loader"
												className="animate-spin"
											/>
										)}
										Save
									</Button>
								</div>
							</form>
						</Reveal>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
