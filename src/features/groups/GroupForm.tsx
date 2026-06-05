import { type ReactNode } from 'react'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { AgentOption, Group } from '@/types/api'
import { useGroupForm } from './useGroupForm'

interface Props {
	group?: Group | null
	onSuccess: (group: Group) => void
	onCancel: () => void
}

export function GroupForm({ group, onSuccess, onCancel }: Props) {
	const {
		isEdit,
		tab,
		setTab,
		register,
		errors,
		adminIds,
		colors,
		toggleAdmin,
		setColor,
		agentOptions,
		isPending,
		onSubmit,
	} = useGroupForm({ group, onSuccess })

	return (
		<form onSubmit={onSubmit} className="space-y-6">
			<div className="flex gap-1 border-b border-border">
				<TabButton
					active={tab === 'general'}
					onClick={() => setTab('general')}
				>
					General
				</TabButton>
				<TabButton
					active={tab === 'theme'}
					onClick={() => setTab('theme')}
				>
					Theme
				</TabButton>
			</div>

			{/* Both panels stay mounted (toggled with `hidden`) so field values and
			    focus survive tab switches and cross-tab validation works. */}
			<div className={tab === 'general' ? 'space-y-6' : 'hidden'}>
				<Field label="Name" error={errors.name?.message}>
					<Input {...register('name')} />
				</Field>
				<Field label="Slug" error={errors.slug?.message}>
					<Input
						disabled={isEdit}
						placeholder={isEdit ? undefined : 'austin-team'}
						{...register('slug')}
					/>
				</Field>
				<Field label="Title logo" error={errors.title_logo?.message}>
					<Input {...register('title_logo')} />
				</Field>
				<Field label="Admins">
					<AdminMultiSelect
						options={agentOptions}
						selected={adminIds}
						onToggle={toggleAdmin}
					/>
				</Field>
			</div>

			<div className={tab === 'theme' ? 'space-y-6' : 'hidden'}>
				<ColorField
					label="Accent"
					value={colors.color_accent}
					onChange={(v) => setColor('color_accent', v)}
					error={errors.color_accent?.message}
				/>
				<ColorField
					label="Primary"
					value={colors.color_primary}
					onChange={(v) => setColor('color_primary', v)}
					error={errors.color_primary?.message}
				/>
				<ColorField
					label="Secondary"
					value={colors.color_secondary}
					onChange={(v) => setColor('color_secondary', v)}
					error={errors.color_secondary?.message}
				/>
				<ColorField
					label="Secondary (light)"
					value={colors.color_secondary_light}
					onChange={(v) => setColor('color_secondary_light', v)}
					error={errors.color_secondary_light?.message}
				/>
				<ColorField
					label="Text"
					value={colors.color_text}
					onChange={(v) => setColor('color_text', v)}
					error={errors.color_text?.message}
				/>
			</div>

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

function ColorField({
	label,
	value,
	onChange,
	error,
}: {
	label: string
	value: string
	onChange: (value: string) => void
	error?: string
}) {
	// A native color picker only accepts 6-digit hex; fall back to black for the
	// swatch when the text value isn't yet a valid 6-digit color.
	const swatch = /^#[0-9a-fA-F]{6}$/.test(value) ? value : '#000000'
	return (
		<div className="space-y-3">
			<Label>{label}</Label>
			<div className="flex items-center gap-3">
				<input
					type="color"
					aria-label={`${label} color picker`}
					value={swatch}
					onChange={(e) => onChange(e.target.value)}
					className="size-9 shrink-0 cursor-pointer rounded-md border border-border bg-transparent"
				/>
				<Input
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className="font-mono"
				/>
			</div>
			{error && <p className="text-xs text-destructive">{error}</p>}
		</div>
	)
}

function AdminMultiSelect({
	options,
	selected,
	onToggle,
}: {
	options: AgentOption[]
	selected: string[]
	onToggle: (id: string) => void
}) {
	const label = selected.length
		? options
				.filter((o) => selected.includes(o.id))
				.map((o) => o.email || o.name || o.id)
				.join(', ')
		: 'Select admins'

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					type="button"
					variant="outline-2"
					className="w-full justify-between text-base font-normal"
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
						No agents
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
								{o.email || o.name || o.id}
							</DropdownMenuItem>
						)
					})
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

function TabButton({
	active,
	onClick,
	children,
}: {
	active: boolean
	onClick: () => void
	children: ReactNode
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			data-active={active}
			className="-mb-px border-b-2 border-transparent px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[active=true]:border-primary data-[active=true]:text-foreground"
		>
			{children}
		</button>
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
