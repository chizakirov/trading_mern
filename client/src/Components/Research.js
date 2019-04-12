import React, {Component} from 'react';
import {Line} from 'react-chartjs-2'; //make sure to install these lib in client folder
import stockservices from '../stockservices';
import '../css/Research.css';

class Research extends Component {
  state = {
    symbol: "",
    companyName: "",
    marketCap: "",
    peRatio: "",
    sector: "",
    week52High: "",
    week52Low:"",
    ytdChange: "",
    xAxis: [],
    yAxis: [],
    news: [],
  };

  setSymbol = symbol => {
    this.setState({ symbol: symbol })
  }

  getChart = async(event) => { 
    try {
      event.preventDefault();

      const res = await stockservices.getNews(this.state.symbol);
      console.log(res.data);
      const chart = res.data.chart;
      const closingPrices = chart.map(price => price['open']);
      const xData= chart.map(price => price['date']);
      this.setState({
        yAxis: closingPrices, 
        xAxis: xData, 
        news: res.data.news, 
        marketCap: res.data.quote.marketCap,
        peRatio: res.data.quote.peRatio,
        week52High: res.data.quote.week52High,
        week52Low: res.data.quote.week52Low,
        ytdChange: res.data.quote.ytdChange,
        sector: res.data.quote.sector,
        companyName: res.data.quote.companyName,
      });

    }catch(err) {
      console.log(err);
    }
  }

  render(){
    let chartData = {
      labels: this.state.xAxis,
      datasets: [
        {
          label: this.state.companyName,
          fill: false,
          borderColor: "#28a745",
          // borderDash: [5, 5],
          backgroundColor: "#28a745",
          pointBackgroundColor: "#28a745",
          pointBorderColor: "#28a745",
          pointHoverBackgroundColor: "#28a745",
          pointHoverBorderColor: "#28a745",
          data: this.state.yAxis
        }],
      options: {
              scales: {
                xAxes: [{
                  scaleLabel: {
                  display: true,
                  labelString: "Date",
                  fontColor: "black",
                  fontSize: 15,
                  fontWeight: 600
                }
                }],
                yAxes: [{
                  scaleLabel: {
                  display: true,
                  labelString: "Price",
                  fontColor: "black",
                  fontSize: 15,
                  fontWeight: 600
                  }
                }]
      }
    }};
      //     }
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
    const { companyName, peRatio, sector, week52High, week52Low, } = this.state;
    const marketCap = this.state.marketCap/1000000;
    const ytdChange = Math.round(this.state.ytdChange * 10000)/100;
;
    return(
      <div className="research">
        <h3>Research Historical Data</h3>

        <h4>Enter a ticker symbol</h4>
        <form className="form" onSubmit={this.getChart}>
          <input id="search-input" type="text" onChange={e => (this.setSymbol(e.target.value))} placeholder="search..."/>
          <button type="submit">Search</button>
        </form>
        <div className="main">
          <div className="stock-stats">
            <p>Company Name: {companyName} </p>
            <p>Sector: {sector}</p>
            <p>Market Cap: {marketCap} M</p>
            <p>52 Week High: {week52High}</p>
            <p>52 Week Low: {week52Low}</p>
            <p>Price/Earnings Ratio: {peRatio}</p>
            <p>YTD Change: {ytdChange}%</p>
          </div>

          <div className="chart">
            <Line data={chartData} options={chartData.options} width="450" height="240"/>
          </div>
        </div>

          <div className="news">
            <h4>Latest News</h4>
            {this.state.news.map(n => {
              return(
                <div className="news-link" key={n.url}>
                  <a id="links" href={ n.url }>{ n.headline }</a>
                </div>
              )
            })}
        </div>
      </div>
    )
  }
}

export default Research;