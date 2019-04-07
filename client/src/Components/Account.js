import React, {Component} from 'react';
import stockservices from '../stockservices';

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
      <div>
        <h1>Account Overview</h1>
        <form onSubmit={this.Deposit}>
          <input type="number" onChange={(e) => {this.onChange(e.target.value)}} />
          <button type="submit">Deposit</button>
        </form>
        Balance: {this.state.balance}
        <br></br>
        Orders: 
        <ul>
          {this.state.orders.map(order => <li key={order._id}>{order.symbol}</li>)}
        </ul>
        {/* Returns: 
        //find each symbol: find opening & closing (buy, sell) = > calculate remaining # of stocks for each symbol. calculate return = (total sell-total buy)/total buy*100 */}

      </div>
    )
  }
}

export default Account;