import React from 'react';

const OrderConfirm = (props) => {
  console.log(props);
  const { date, price, quantity, symbol, total, type } = props.location.state.data;
  return (
    <div>
      <h1>Order Summary</h1>
      <p>{date}</p>
      <p>{price}</p>
      <p>{quantity}</p>
      <p>{symbol}</p>
      <p>{total}</p>
      <p>{type}</p>
    </div>
  )
}

export default OrderConfirm;