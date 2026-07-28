import { Badge } from '@/components/ui/badge'
import { DetailPage } from '@/components/detail/DetailPage'
import { DetailPageProvider } from '@/components/detail/DetailPageContext'
import { DetailBody } from '@/components/detail/DetailBody'
import { MediaThumbnail } from '@/components/media/MediaThumbnail'
import { PropertyImagesTab } from './PropertyImagesTab'
import { usePropertyDetailPage } from './usePropertyDetailPage'
import { formatDateTime, formatLocation, formatOurOffer } from './format'

export function PropertyDetailPage() {
	const { property, openImage, ...detailCtx } = usePropertyDetailPage()

	return (
		<DetailPageProvider value={detailCtx}>
			<DetailPage
				title="Property"
				deleteTitle="Delete property?"
				deleteDescription={`Property "${property?.address ?? ''}" will be permanently deleted.`}
				tabs={[
					{
						key: 'details',
						label: 'Details',
						content: property ? (
							<DetailBody
								heading={{
									title: property.address,
									subtitle: formatLocation(property),
									avatar: (
										<MediaThumbnail
											url={property.image}
											shape="square"
											placeholderIcon="image"
											canvas
											size={256}
										/>
									),
									badge: property.status ? (
										<Badge variant="outline">
											{property.status}
										</Badge>
									) : undefined,
								}}
								intro={
									property.description && (
										<p className="text-sm wrap-break-word whitespace-pre-line text-muted-foreground">
											{property.description}
										</p>
									)
								}
								fields={[
									{
										label: 'Property type',
										value: property.property_type,
									},
									{
										label: 'Asking price',
										value: property.asking_price ?? '',
									},
									{
										label: 'Our offer',
										value: formatOurOffer(property.our_offer),
									},
									{ label: 'City', value: property.city },
									{ label: 'State', value: property.state },
									{ label: 'ZIP code', value: property.zip_code },
									{ label: 'Beds', value: property.beds },
									{ label: 'Baths', value: property.baths },
									{ label: 'Garage', value: property.garage },
									{ label: 'Sqft', value: property.sqft },
									{
										label: 'Year built',
										value: property.year_built,
									},
									{
										label: 'Occupied status',
										value: property.occupied_status ?? '',
									},
									{
										label: 'Majors needed',
										value: property.majors_needed ?? '',
									},
									{
										label: 'Available to',
										value: property.available.join(', '),
									},
									{
										label: 'Acquisition agent',
										value: property.acquisition_agent,
									},
									{
										label: 'Contact person',
										value: property.contact_person,
									},
									{
										label: 'Lead source',
										value: property.lead_source,
									},
									{
										label: 'Group',
										value: property.group_name ?? '',
									},
									{
										label: 'Owner',
										value: property.user_email,
									},
									{
										label: 'Coordinates',
										value: property.coordinates ?? '',
									},
									{
										label: 'Seller notes',
										value: property.seller_notes ?? '',
									},
									{
										label: 'Created',
										value: formatDateTime(property.created_at),
									},
								]}
							/>
						) : null,
					},
					{
						key: 'images',
						label: property
							? `Images (${property.images.length})`
							: 'Images',
						bare: true,
						content: property ? (
							<PropertyImagesTab
								propertyId={property.id}
								images={property.images}
								onOpen={openImage}
							/>
						) : null,
					},
				]}
			/>
		</DetailPageProvider>
	)
}
