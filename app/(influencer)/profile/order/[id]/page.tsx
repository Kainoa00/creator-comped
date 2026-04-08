import { DEMO_ORDERS } from '@/lib/demo-data'
import OrderDetail from './OrderDetail'

export function generateStaticParams() {
  return DEMO_ORDERS.map((o) => ({ id: o.id }))
}

export default function Page(props: { params: Promise<{ id: string }> }) {
  return <OrderDetail params={props.params} />
}
