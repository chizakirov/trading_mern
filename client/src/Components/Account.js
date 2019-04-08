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
    const res = await stockservices.allOrders();
    console.log(res.data);
    this.setState({orders: res.data.orders, balance: res.data.balance});
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
        <div className="account-stats">
          <h1>Account Overview</h1>
          <form onSubmit={this.Deposit}>
            <input type="number" onChange={(e) => {this.onChange(e.target.value)}} />
            <button type="submit">Deposit</button>
          </form>
          Balance: {this.state.balance}
        </div>
        <h3>Order History</h3>
        <table className="position_table">
          <tr>
            <th>Symbol</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
            <th>Date</th>
          </tr>
            {this.state.orders.map(order => 
              { const total = Math.round(+order.quantity * +order.price*100)/100;
                return(
                <tr key={order._id}>
                  <td>{order.symbol}</td>
                  <td>{order.type}</td>
                  <td>{order.quantity}</td>
                  <td>{order.price}</td>
                  <td>{total}</td>
                  <td>{order.date}</td>
                </tr>
              )}
            )}
        </table>
      </div>
    )
  }
}

export default Account;