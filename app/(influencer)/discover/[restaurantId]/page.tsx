import { DEMO_RESTAURANTS } from '@/lib/demo-data'
import RestaurantDetail from './RestaurantDetail'

export function generateStaticParams() {
  return DEMO_RESTAURANTS.map((r) => ({ restaurantId: r.id }))
}

export default function Page(props: { params: Promise<{ restaurantId: string }> }) {
  return <RestaurantDetail params={props.params} />
}
