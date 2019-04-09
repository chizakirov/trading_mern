import React, {Component} from 'react';
import stockservices from '../stockservices';
import '../css/Account.css';

class Account extends Component{
  state = {
    balance: 0,
    orderBalance: 0,
    deposit: 0,
    orders: []
  }

  async componentDidMount() {
    try{
      const res = await stockservices.allOrders();
      this.setState({orders: res.data.orders, balance: res.data.balance});
      // const orderBalance = await stockservices.currentBalance();
      // this.setState({orderBalance: orderBalance});
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
    console.log(res);
  }

  render(){
    return(
      <div className="account-wrapper">
        <h1>Account Overview</h1>
        <div className="deposit">
          <h4>Enter an amount to deposit</h4>
          <form onSubmit={this.Deposit}>
            <input type="number" onChange={e => {this.onChange(e.target.value)}} />
            <button type="submit">Deposit</button>
          </form>
          <h3>Balance: ${this.state.balance}</h3>
          {/* <h3>Order Balance: {this.state.orderBalance}</h3> */}
        </div>
        <h3>Order History</h3>
        <table className="position_table">
          <tr>
            <th>Stock</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
            <th>Date</th>
          </tr>
            {this.state.orders.map(order => 
              { const total = Math.round(+order.quantity * +order.price*100)/100;
                const orderDate = new Date(order.date).toDateString('MM/DD/YYYY');
                return(
                <tr key={order._id}>
                  <td>{order.symbol}</td>
                  <td>{order.type}</td>
                  <td>{order.quantity}</td>
                  <td>{order.price}</td>
                  <td>{total}</td>
                  <td>{orderDate}</td>
                </tr>
              )}
            )}
        </table>
      </div>
    )
  }
}

export default Account;