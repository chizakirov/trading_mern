import React, { Component } from 'react';
import axios from 'axios';
import debounce from 'lodash/debounce'; //select only 1 module of lodash, not entire lodash
import stockservices from '../stockservices';
import '../css/Order.css';

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      symbol: "",
      price: 1,
      companyName: "",
      quantity: 1,
      type: "",
      err: ''
    };
  }

  placeOrder = (event) => {
    event.preventDefault();
    const { symbol, price, quantity, type } = this.state;
    const stock = {
      symbol,
      price: +price,
      quantity: +quantity,
      type: type,
      total: +price * +quantity
    }
    stockservices.order(stock)
      .then(res => {
        console.log(res.data.message)
        if (res.data.message) {
          this.setState({ err: res.data.message });
        } else {
          this.props.history.push({
            pathname: "/orderConfirm",
            state: { data: res.data }
          })
        }
      })
      .catch(err => console.log('error placing order', err));
  }

  fetchAPI() {
    axios.get(`https://api.iextrading.com/1.0/stock/${this.state.symbol}/batch?types=quote,news,chart&range=1m&last=10`)
      .then(res => this.setState({
        price: res.data.quote.latestPrice,
        companyName: res.data.quote.companyName
      }))
      .catch(err => console.log(err))
  }

  setSymbol = debounce(symbol => {
    this.setState({ symbol: symbol })
    this.fetchAPI()
  }, 1000)

  setType = (type) => {
    this.setState({ type });
  }

  setQuantity = (quantity) => {
    this.setState({ quantity });
  }

  render() {
    return (
      <div className="Order">
        {this.state.err && <h1> {this.state.err} </h1>}
        <h1 id="order-title">Place a trade</h1>
        <h3>Search stock quote by ticker symbol</h3>
        <div className="stats">
          <p>Company Name: {this.state.companyName}</p>
          <p>Symbol: {this.state.symbol}</p>
          <p>Latest Price: {this.state.price}</p>
        </div>
        <form className="order-form" onSubmit={this.placeOrder}>
          Symbol: <input className="order-input" type="text" name="symbol" onChange={e => this.setSymbol(e.target.value)} />

          Trade Type:
            <select className="order-input" type="text" name="type" value={this.state.type} onChange={e => this.setType(e.target.value)}>
            <option>Select a trade type</option>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>

          Price: <input className="order-input" type="number" name="price" value={this.state.price} onChange={e => this.setSymbol(e.target.value)} disabled />

          Quantity: <input className="order-input" type="number" name="quantity" onChange={e => this.setQuantity(e.target.value)} />

          <button id="order-button" type="submit">Order</button>
        </form>

      </div>
    )
  }
}

export default Order;