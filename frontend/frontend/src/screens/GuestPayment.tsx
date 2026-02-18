import React from 'react'
import { useParams } from 'react-router-dom';
import OrderDetails from './OrderDetails';


const GuestPayment = () => {

  const { orderUUID } = useParams<{ orderUUID: string }>();

  const {orderId} = useParams<{ orderId: string }>();

  return (
    <OrderDetails orderPropId={orderId} uuid={orderUUID} />
  )
}

export default GuestPayment