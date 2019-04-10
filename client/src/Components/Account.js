import React, {Component} from 'react';
import stockservices from '../stockservices';
import '../css/Account.css';

class Account extends Component{
  state = {
    balance: 0,
    deposit: 0,
    orders: []
  }

  async componentDidMount() {
    try{
      const res = await stockservices.allOrders();
      // console.log(" res", res);
      this.setState({orders: res.data.orders, balance: res.data.balance});
    }catch(err){
      console.log(err)
    }
  }
  onChange = (deposit) => {
    this.setState({ deposit })
  }

  Deposit = async(event)=> {
    event.preventDefault();
    const res = await stockservices.updateBalance({deposit: this.state.deposit});
    this.setState({balance: res.data})
    // console.log(res);
  }

  render(){
    let orderTotal = 0;
    if(this.state.orders.length){
        orderTotal = this.state.orders.reduce((sum, order) => {
        if(order.type.toLowerCase() === "buy"){
          return sum - order.total;
        }else{
          return sum + order.total;
        }
      }, 0);
      console.log("total of orders", orderTotal);
    };
    const currentBalance = Math.round((this.state.balance + orderTotal)*100)/100;

    return(
      <div className="account-wrapper">
        <h1>Account Overview</h1>
        <div className="deposit">
          <h4>Enter an amount to deposit</h4>
          <form onSubmit={this.Deposit}>
            <input type="number" onChange={e => {this.onChange(e.target.value)}} />
            <button type="submit">Deposit</button>
          </form>
          <h4>Initial Balance: ${this.state.balance}</h4>
          <h4>Current Balance: ${currentBalance}</h4>
        </div>
        <h3>Order History</h3>
        <table className="position_table">
        <thead>
          <tr>
              <th>Stock</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
        </thead>
         <tbody>
         {this.state.orders.map(order => 
              { 
                const total = Math.round(+order.quantity * +order.price*100)/100;
                const orderDate = new Date(order.date).toDateString("MM/DD/YYYY");

                return(
                <tr key={order._id}>
                  <td className="order-detail">{order.symbol.toUpperCase()}</td>
                  <td className="order-detail">{order.type[0].toUpperCase() + order.type.slice(1)}</td>
                  <td className="order-detail">{order.quantity}</td>
                  <td className="order-detail">${order.price}</td>
                  <td className="order-detail">${total}</td>
                  <td className="order-detail">{orderDate}</td>
                </tr>
              )}
            )}
         </tbody>
            
        </table>
      </div>
    )
  }
}

export default Account;