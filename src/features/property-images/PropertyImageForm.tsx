import { FormLayout } from '@/components/form/FormLayout'
import type { FormFieldEntry } from '@/components/form/types'
import type { PropertyImage } from '@/types/api'
import { UNLINKED, usePropertyImageForm } from './usePropertyImageForm'

interface Props {
	image: PropertyImage
	onSuccess: (image: PropertyImage) => void
	onCancel: () => void
}

export function PropertyImageForm({ image, onSuccess, onCancel }: Props) {
	const {
		form,
		propertyOptions,
		propertiesLoading,
		onPropertySearch,
		hasMoreProperties,
		loadingMoreProperties,
		onLoadMoreProperties,
		selectedPropertyLabel,
		isPending,
		onSubmit,
	} = usePropertyImageForm({ image, onSuccess })

	const fields: FormFieldEntry[] = [
		{
			type: 'select',
			name: 'property_id',
			label: 'Property',
			searchable: true,
			placeholder: 'Select a property',
			searchPlaceholder: 'Search properties…',
			options: [
				{ value: UNLINKED, label: 'Unlinked' },
				...propertyOptions,
			],
			onSearch: onPropertySearch,
			loading: propertiesLoading,
			selectedLabel: selectedPropertyLabel,
			onLoadMore: onLoadMoreProperties,
			hasMore: hasMoreProperties,
			loadingMore: loadingMoreProperties,
		},
		{
			type: 'number',
			name: 'sort',
			label: 'Sort order',
		},
	]

	return (
		<FormLayout
			form={form}
			fields={fields}
			onSubmit={onSubmit}
			onCancel={onCancel}
			isPending={isPending}
		/>
	)
}
