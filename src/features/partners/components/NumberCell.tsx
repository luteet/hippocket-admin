import { Input } from '@/components/ui/input'
import type { Partner } from '@/types/api'
import { stopRowClick, type EditableField } from '../usePartnersPage'

interface CellProps {
	partner: Partner
	field: EditableField
	getCell: (partner: Partner, field: EditableField) => string
	setCell: (partner: Partner, field: EditableField, value: string) => void
}

export function NumberCell({ partner, field, getCell, setCell }: CellProps) {
	return (
		<Input
			type="number"
			step="any"
			className="h-9 w-28"
			placeholder="-"
			value={getCell(partner, field)}
			onChange={(e) => setCell(partner, field, e.target.value)}
			onClick={stopRowClick}
		/>
	)
}
