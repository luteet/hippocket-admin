import { FormPage } from '@/components/form/FormPage'
import { Field } from '@/components/Field'
import { Icon } from '@/components/Icon'
import { GroupMultiSelect } from '@/components/GroupMultiSelect'
import { Button } from '@/components/ui/button'
import { Combobox } from '@/components/ui/combobox'
import { DatePicker } from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import { ExportSelect } from './components/ExportSelect'
import { useReferralExportPage, ALL } from './useReferralExportPage'

export function ReferralExportPage() {
	const {
		search,
		setSearch,
		statusLabel,
		setStatusLabel,
		isPaid,
		setIsPaid,
		createdFrom,
		setCreatedFrom,
		createdTo,
		setCreatedTo,
		groupIds,
		toggleGroup,
		partnerId,
		setPartnerId,
		agentId,
		setAgentId,
		sortBy,
		setSortBy,
		order,
		setOrder,
		statusOptions,
		partnerOptions,
		agentOptions,
		groupOptions,
		isLoadingPartners,
		isLoadingAgents,
		paidOptions,
		sortOptions,
		orderOptions,
		activeFilterCount,
		resetFilters,
		handleExport,
		isExporting,
		goBack,
	} = useReferralExportPage()

	return (
		<FormPage
			title="Export pipeline logs"
			onBack={goBack}
			maxWidth="max-w-3xl"
		>
			<div className="space-y-6">
				<p className="text-sm text-muted-foreground">
					Exports the filtered selection to an Excel file. Leave a
					filter empty to include everything; the file matches what
					the Referrals list shows for these filters.
				</p>

				<div className="grid gap-6 sm:grid-cols-2">
					<Field label="Search">
						<Input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search…"
						/>
					</Field>

					<ExportSelect
						label="Status"
						value={statusLabel}
						onChange={setStatusLabel}
						options={[
							{ value: ALL, label: 'All statuses' },
							...statusOptions,
						]}
					/>

					<ExportSelect
						label="Payment"
						value={isPaid}
						onChange={setIsPaid}
						options={paidOptions}
					/>

					<Field label="Partner">
						<Combobox
							value={partnerId}
							onValueChange={setPartnerId}
							options={partnerOptions}
							loading={isLoadingPartners}
							placeholder="Any partner"
							searchPlaceholder="Search partners…"
							emptyText="No partners"
						/>
					</Field>

					<Field label="Agent">
						<Combobox
							value={agentId}
							onValueChange={setAgentId}
							options={agentOptions}
							loading={isLoadingAgents}
							placeholder="Any agent"
							searchPlaceholder="Search agents…"
							emptyText="No agents"
						/>
					</Field>

					<Field label="Groups">
						<GroupMultiSelect
							options={groupOptions}
							selected={groupIds}
							onToggle={toggleGroup}
						/>
					</Field>

					<Field label="Created from">
						<DatePicker
							value={createdFrom}
							onChange={setCreatedFrom}
							placeholder="Any date"
						/>
					</Field>

					<Field label="Created to">
						<DatePicker
							value={createdTo}
							onChange={setCreatedTo}
							placeholder="Any date"
						/>
					</Field>

					<ExportSelect
						label="Sort by"
						value={sortBy}
						onChange={setSortBy}
						options={sortOptions}
					/>

					<ExportSelect
						label="Order"
						value={order}
						onChange={setOrder}
						options={orderOptions}
					/>
				</div>

				<div className="flex flex-wrap items-center justify-end gap-2 pt-4">
					<Button
						type="button"
						variant="outline"
						className="mr-auto"
						disabled={activeFilterCount === 0}
						onClick={resetFilters}
					>
						Reset
					</Button>
					<Button
						type="button"
						disabled={isExporting}
						className="flex-auto xs:min-w-40 xs:flex-none"
						onClick={handleExport}
					>
						{isExporting ? (
							<Icon name="loader" className="animate-spin" />
						) : (
							<Icon name="download" />
						)}
						Export to Excel
					</Button>
				</div>
			</div>
		</FormPage>
	)
}
