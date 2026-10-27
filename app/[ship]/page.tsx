import { BookingPage } from '../page'

export default async function ShipPage({ params }: { params: Promise<{ ship: string }> }) {
  const { ship } = await params
  return <BookingPage initialShipSlug={ship} />
}
