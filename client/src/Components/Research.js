import React, {Component} from 'react';
import debounce from 'lodash/debounce';
import {Line} from 'react-chartjs-2'; //make sure to install these lib in client folder
import stockservices from '../stockservices';

class Research extends Component {
  state = {
    symbol: "",
    companyName: "",
    xAxis: [],
    yAxis: [] 
  };

  setSymbol = symbol => {
    this.setState({ symbol: symbol })
  }

  getChart = async(event) => { 
    try {
      event.preventDefault();
      const res = await stockservices.getChart(this.state.symbol);
      this.setState({xAxis: Object.keys(res.data['Time Series (1min)'])})
      const prices = Object.values(res.data['Time Series (1min)']);
      const closingPrices = prices.map(price => price['4. close']);
      this.setState({yAxis: closingPrices});
    }catch(err) {
      console.log(err);
    }
  }

  render(){
    let chartData = {
      labels: this.state.xAxis,
      datasets: [
        {
          label: this.state.symbol,
          fillColor: "rgba(220,220,220,0.2)",
          strokeColor: "rgba(220,220,220,1)",
          pointColor: "rgba(220,220,220,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: this.state.yAxis}
        // },
        // {
        //   label: "My Second dataset",
        //   fillColor: "rgba(151,187,205,0.2)",
        //   strokeColor: "rgba(151,187,205,1)",
        //   pointColor: "rgba(151,187,205,1)",
        //   pointStrokeColor: "#fff",
        //   pointHighlightFill: "#fff",
        //   pointHighlightStroke: "rgba(151,187,205,1)",
        //   data: [28, 48, 40, 19, 86, 27, 90]
        // }
      ]
    };

    return(
      <div>
        Enter a ticker Symbol:
        <form onSubmit={this.getChart}>
          <input type="text" onChange={e => (this.setSymbol(e.target.value))}/>
          <button type="submit">Search</button>
        </form>
        <p>Symbol: {this.state.symbol}</p>
        <Line data={chartData} width="450" height="200"/>
      </div>
    )
  }
}

export default Research;