import { Input } from '@/components/ui/input'
import type { Partner } from '@/types/api'
import { stopRowClick, type EditableField } from '../usePartnersPage'

interface CellProps {
	partner: Partner
	field: EditableField
	getCell: (partner: Partner, field: EditableField) => string
	setCell: (partner: Partner, field: EditableField, value: string) => void
	/** Persist this field on blur (no-op if the value is unchanged). */
	saveField: (partner: Partner, field: EditableField, value: string) => void
}

export function NumberCell({
	partner,
	field,
	getCell,
	setCell,
	saveField,
}: CellProps) {
	return (
		<Input
			type="number"
			step="any"
			className="h-9 w-28"
			placeholder="-"
			value={getCell(partner, field)}
			onChange={(e) => setCell(partner, field, e.target.value)}
			onBlur={() => saveField(partner, field, getCell(partner, field))}
			onMouseDown={stopRowClick}
			onClick={stopRowClick}
		/>
	)
}
