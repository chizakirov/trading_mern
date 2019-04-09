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
        if (res.data.message) {
          this.setState({ err: res.data.message });
        } else {
          this.props.history.push({
            pathname: "/account",
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
      <div className="order-wrapper">
        <div className="Order">
<<<<<<< HEAD
          {/* {this.state.err && <h1> {this.state.err} </h1>}
         / */}
          <h3>Enter a ticker symbol to place a trade</h3>
=======
          {this.state.err && <h1> {this.state.err} </h1>}
          <h1 id="order-title">Place a trade</h1>
          <div className="stats">
            <p>Company Name: {this.state.companyName}</p>
            <p>Symbol: {this.state.symbol}</p>
            <p>Latest Price: {this.state.price}</p>
          </div>
          <h3>Enter a ticker symbol</h3>
>>>>>>> 50408b8e29a06dc0f7fa4d5c638477faa654ea47
          <form className="order-form" onSubmit={this.placeOrder}>
            <label>Symbol <span>&#42;</span>:</label>
            <input className="order-input" type="text" name="symbol" onChange={e => this.setSymbol(e.target.value)} placeholder="enter a symbol"/> 

<<<<<<< HEAD
            <label>Company:</label>
            <input className="order-input" type="text" value={this.state.companyName} name="companyName" onChange={e => this.setSymbol(e.target.value)} disabled/>

=======
>>>>>>> 50408b8e29a06dc0f7fa4d5c638477faa654ea47
            <label>Trade Type <span>&#42;</span>:</label>
              <select className="order-input" type="text" name="type" value={this.state.type} onChange={e => this.setType(e.target.value)}>
              <option>Select a trade type</option>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>

            <label>Price <span>&#42;</span>:</label>
            <input className="order-input" type="number" name="price" value={this.state.price} onChange={e => this.setSymbol(e.target.value)} disabled />

            <label>Quantity <span>&#42;</span>:</label>
            <input className="order-input" type="number" name="quantity" onChange={e => this.setQuantity(e.target.value)} placeholder="enter a quantity"/>

            <button id="order-button" type="submit">Order</button>
          </form>
        </div>
      </div>
    )
  }
}

export default Order;