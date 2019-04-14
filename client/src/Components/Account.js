import React, {Component} from 'react';
// import _ from 'lodash/groupBy';
// import sumBy from 'lodash/sumBy';
import stockservices from '../stockservices';
import '../css/Account.css';

class Account extends Component{
  state = {
    balance: 0,
    currentBalance: 0,
    deposit: 0,
    returns: 0,
    orders: [],
    err: ''
  }

  async getInfo(){
    try{
      const res = await stockservices.allOrders();
      this.setState({
        orders: res.data.orders, 
        balance: res.data.balance, 
        currentBalance: res.data.currentBalance
      });

      let orderTotal = 0;
      if(this.state.orders.length > 0){
        orderTotal = this.state.orders.reduce((sum, order) => {
        if(order.type.toLowerCase() === "buy"){
          return sum - order.total;
        }else{
          return sum + order.total;
        }
        }, 0);
        const curBalance = +Math.round((this.state.balance + orderTotal)*100)/100;
        console.log('curBalance ', curBalance);
        this.setState({ currentBalance: curBalance });
      };
    }catch(err){
      this.setState({ err });
    }
  }

  componentDidMount(){
    this.getInfo();
  }

  onChange = (deposit) => {
    this.setState({ deposit })
  }

  Deposit = async(event)=> {
    try{
      event.preventDefault();
      const res = await stockservices.updateBalance({deposit: this.state.deposit});
      this.setState({ balance: res.data.balance, currentBalance: res.data.currentBalance })
    }catch(err){
      this.setState({ err });
    }
    
  }

  render(){
    const { balance, currentBalance } = this.state;
    return(
      <div className="account-wrapper">
        <h1>Account Overview</h1>
        <div className="deposit">
          <h4>Enter an amount to deposit</h4>
          <form onSubmit={this.Deposit}>
            <input type="number" onChange={e => {this.onChange(e.target.value)}} />
            <button type="submit">Deposit</button>
          </form>
          <h4>Initial Balance: ${balance}</h4>
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
         {this.state.orders && this.state.orders.map(order => 
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