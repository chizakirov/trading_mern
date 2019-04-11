import axios from 'axios';

// For any sensitive routes, remember to fetch the JWT token from local storage and send that in 
// along with the request

export default {

  getChart(symbol) {
    //axios acts like a http wrapper
    return axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=GJDPYAUM37X04R7H`);
  },

  getQuote(symbol) {
    return axios.get(`/api/stock/${symbol}`);
  },

  getNews(symbol) {
    return axios.get(`https://api.iextrading.com/1.0/stock/${symbol}/batch?types=quote,news,chart&range=1m&last=10`);
    // another API: https://newsapi.org/v2/everything?q=${symbol}&from=2019-01-29&sortBy=popularity&apiKey=3978d00e72c34c9f9d5f6da04b681b80`);
  },

  getMultipleStock(symbol1, symbol2, symbol3) {
    return axios.get(`https://api.iextrading.com/1.0/stock/market/batch?symbols=${symbol1},${symbol2},${symbol3}&types=quote,news,chart&range=1m&last=5`);
  },

  order(order) {
    const jwtToken = localStorage.getItem('jwt');
    // console.log('successfully placed order', order);
    console.log('token? ', jwtToken);
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      data: JSON.stringify(order),
      url: '/api/order'
    };
    return axios(options)
  },

  showOrder() {
    return axios.get('/api/order/');
  },

  allPositions() {
    return axios.get('/api/position');
  },

  allOrders() {
    const jwtToken = localStorage.getItem('jwt');
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwtToken}`
      },
      url: '/api/user/orders'
    };
    return axios(options);
  },

  getOnePosition(symbol) {
    return axios.get(`/api/position/${symbol}`);
  },

  currentBalance() {
    return axios.get('/api/account');
  },

  updateBalance(deposit) {
    const jwtToken = localStorage.getItem('jwt');
    const options = {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      data: JSON.stringify(deposit),
      url: '/api/user/account'
    };
    return axios(options);
  },

  // getReturns(){
  //   const jwtToken = localStorage.getItem('jwt');
  //   const options = {
  //     method: 'GET',
  //     headers: {
  //       'Authorization': `Bearer ${jwtToken}`
  //     },
  //     url: '/api/user/returns'
  //   };
  //   return axios(options);
  // }
}
