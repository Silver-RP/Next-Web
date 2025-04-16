

import OrderDetails from './OrderDetails';

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  return <OrderDetails orderId={params.id} />;
}
