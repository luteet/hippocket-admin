import { type ReactNode } from 'react'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Agent, GroupOption } from '@/types/api'
import { ROLE_OPTIONS, STATUS_OPTIONS } from './useAgentsPage'
import { useAgentForm, type AgentFormValues } from './useAgentForm'

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
					{chosenGroupId && (
						<button
							type="button"
							aria-label="Clear selection"
							onPointerDown={(e) => e.stopPropagation()}
							onClick={(e) => {
								e.stopPropagation()
								setChosenGroup('')
							}}
							className="absolute right-8 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground hover:text-foreground"
						>
							<Icon name="x" className="size-4" />
						</button>
					)}
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
					className="flex-auto xs:flex-none"
					onClick={onCancel}
				>
					Cancel
				</Button>
				<Button
					type="submit"
					disabled={isPending}
					className="flex-auto xs:flex-none"
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

function GroupMultiSelect({
	options,
	selected,
	onToggle,
}: {
	options: GroupOption[]
	selected: number[]
	onToggle: (id: number) => void
}) {
	const label = selected.length
		? options
			.filter((o) => selected.includes(o.id))
			.map((o) => o.name)
			.join(', ')
		: 'Select groups'

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					type="button"
					variant="outline"
					className="w-full justify-between font-normal"
				>
					<span
						className={
							selected.length
								? 'truncate'
								: 'truncate text-muted-foreground'
						}
					>
						{label}
					</span>
					<Icon name="chevron-down" className="size-4 opacity-50" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="max-h-64 w-(--radix-dropdown-menu-trigger-width) overflow-y-auto">
				{options.length === 0 ? (
					<div className="px-2 py-1.5 text-sm text-muted-foreground">
						No groups
					</div>
				) : (
					options.map((o) => {
						const checked = selected.includes(o.id)
						return (
							<DropdownMenuItem
								key={o.id}
								onSelect={(e) => {
									e.preventDefault()
									onToggle(o.id)
								}}
							>
								<span className="flex size-4 items-center justify-center">
									{checked && <Icon name="check" />}
								</span>
								{o.name}
							</DropdownMenuItem>
						)
					})
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

function SectionTitle({
	first,
	children,
}: {
	first?: boolean
	children: ReactNode
}) {
	return (
		<div className={first ? "space-y-8" : "space-y-8 pt-6"}>
			{!first && <Separator />}
			<p className="text-lg font-medium text-muted-foreground">
				{children}
			</p>
		</div>
	)
}

function SwitchField({
	id,
	label,
	checked,
	onCheckedChange,
}: {
	id: string
	label: string
	checked: boolean
	onCheckedChange: (checked: boolean) => void
}) {
	return (
		<Label
			htmlFor={id}
			className="flex cursor-pointer items-center justify-between rounded-md border border-border p-4 text-sm"
		>
			{label}
			<Switch
				id={id}
				checked={checked}
				onCheckedChange={onCheckedChange}
			/>
		</Label>
	)
}

function Field({
	label,
	error,
	children,
}: {
	label: string
	error?: string
	children: ReactNode
}) {
	return (
		<div className="space-y-3">
			<Label>{label}</Label>
			{children}
			{error && <p className="text-xs text-destructive">{error}</p>}
		</div>
	)
}
