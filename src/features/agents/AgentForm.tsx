import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Field } from '@/components/Field'
import { SectionTitle } from '@/components/SectionTitle'
import { SwitchField } from '@/components/SwitchField'
import type { Agent } from '@/types/api'
import { ROLE_OPTIONS, STATUS_OPTIONS } from './useAgentsPage'
import { useAgentForm, type AgentFormValues } from './useAgentForm'
import { GroupMultiSelect } from './components/GroupMultiSelect'

interface Props {
	agent?: Agent | null
	onSuccess: (agent: Agent) => void
	onCancel: () => void
}

export function AgentForm({ agent, onSuccess, onCancel }: Props) {
	const {
		isEdit,
		register,
		errors,
		setValue,
		role,
		status,
		groupIds,
		chosenGroupId,
		toggleGroup,
		setChosenGroup,
		isActive,
		isNewUser,
		isHide,
		defaultAdmin,
		groupOptions,
		isPending,
		onSubmit,
	} = useAgentForm({ agent, onSuccess })

	// The chosen (primary) group must be one of the selected memberships.
	const chosenOptions = groupOptions.filter((g) => groupIds.includes(g.id))

	return (
		<form onSubmit={onSubmit} className="space-y-6">
			<SectionTitle first>Account</SectionTitle>
			<Field label="Email" error={errors.email?.message}>
				<Input type="email" disabled={isEdit} {...register('email')} />
			</Field>
			{isEdit && (
				<Field label="New email" error={errors.pending_email?.message}>
					<Input
						type="email"
						placeholder="Pending — applied after the agent confirms it"
						{...register('pending_email')}
					/>
				</Field>
			)}
			<Field
				label={isEdit ? 'New password' : 'Password'}
				error={errors.password?.message}
			>
				<Input
					type="password"
					autoComplete="new-password"
					placeholder={
						isEdit ? 'Leave blank to keep current' : undefined
					}
					{...register('password')}
				/>
			</Field>
			<Field label="Username" error={errors.username?.message}>
				<Input {...register('username')} />
			</Field>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Field label="First name" error={errors.first_name?.message}>
					<Input {...register('first_name')} />
				</Field>
				<Field label="Last name" error={errors.last_name?.message}>
					<Input {...register('last_name')} />
				</Field>
			</div>
			<Field label="Phone" error={errors.phone?.message}>
				<Input {...register('phone')} />
			</Field>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Field label="Company" error={errors.company?.message}>
					<Input {...register('company')} />
				</Field>
				<Field label="Address" error={errors.address?.message}>
					<Input {...register('address')} />
				</Field>
			</div>

			<SectionTitle>Classification</SectionTitle>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Field label="Role">
					<Select
						value={role}
						onValueChange={(v) =>
							setValue('role', v as AgentFormValues['role'])
						}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{ROLE_OPTIONS.map((o) => (
								<SelectItem key={o.value} value={o.value}>
									{o.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</Field>
				<Field label="Status">
					<Select
						value={status}
						onValueChange={(v) =>
							setValue('status', v as AgentFormValues['status'])
						}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{STATUS_OPTIONS.map((o) => (
								<SelectItem key={o.value} value={o.value}>
									{o.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</Field>
			</div>
			<Field label="Groups">
				<GroupMultiSelect
					options={groupOptions}
					selected={groupIds}
					onToggle={toggleGroup}
				/>
			</Field>
			<Field label="Chosen group">
				<div className="relative">
					<Select
						value={chosenGroupId || undefined}
						onValueChange={setChosenGroup}
						disabled={chosenOptions.length === 0}
					>
						<SelectTrigger
							className={
								chosenGroupId ? '[&>span]:pr-8' : undefined
							}
						>
							<SelectValue
								placeholder={
									chosenOptions.length === 0
										? 'Select groups first'
										: 'Select a chosen group'
								}
							/>
						</SelectTrigger>
						<SelectContent>
							{chosenOptions.map((g) => (
								<SelectItem key={g.id} value={String(g.id)}>
									{g.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</Field>

			<SectionTitle>Balance</SectionTitle>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Field label="Balance ($)" error={errors.balance?.message}>
					<Input
						type="number"
						step="0.01"
						{...register('balance', { valueAsNumber: true })}
					/>
				</Field>
				<Field
					label="Token balance"
					error={errors.balance_coin?.message}
				>
					<Input
						type="number"
						step="0.01"
						{...register('balance_coin', { valueAsNumber: true })}
					/>
				</Field>
			</div>

			<SectionTitle>Payment methods</SectionTitle>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Field label="PayPal" error={errors.paypal_data?.message}>
					<Input {...register('paypal_data')} />
				</Field>
				<Field label="Venmo" error={errors.venmo_id?.message}>
					<Input {...register('venmo_id')} />
				</Field>
				<Field label="Cash App" error={errors.cash_app_info?.message}>
					<Input {...register('cash_app_info')} />
				</Field>
				<Field label="Zelle" error={errors.zelle?.message}>
					<Input {...register('zelle')} />
				</Field>
			</div>
			<Field
				label="License number"
				error={errors.license_number?.message}
			>
				<Input {...register('license_number')} />
			</Field>

			<SectionTitle>Flags</SectionTitle>
			<SwitchField
				id="is_active"
				label="Active"
				checked={isActive}
				onCheckedChange={(v) => setValue('is_active', v)}
			/>
			<SwitchField
				id="is_new_user"
				label="New user"
				checked={isNewUser}
				onCheckedChange={(v) => setValue('is_new_user', v)}
			/>
			{!isEdit && (
				<>
					<SwitchField
						id="is_hide"
						label="Hidden"
						checked={isHide}
						onCheckedChange={(v) => setValue('is_hide', v)}
					/>
					<SwitchField
						id="default_admin"
						label="Default admin"
						checked={defaultAdmin}
						onCheckedChange={(v) => setValue('default_admin', v)}
					/>
				</>
			)}

			<div className="flex justify-end gap-2 pt-4">
				<Button
					type="button"
					variant="outline"
					className="flex-auto xs:min-w-32 xs:flex-none"
					onClick={onCancel}
				>
					Cancel
				</Button>
				<Button
					type="submit"
					disabled={isPending}
					className="flex-auto xs:min-w-32 xs:flex-none"
				>
					{isPending && (
						<Icon name="loader" className="animate-spin" />
					)}
					Save
				</Button>
			</div>
		</form>
	)
}
