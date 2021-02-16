import React, { Component } from 'react'
import {Button, CardColumns, Row, Col} from 'react-bootstrap'
import NewsCard from '../components/NewsHeadlineCard'
import { Redirect } from 'react-router-dom'
import {instance, coingekoinstance, newsapi} from '../axios';
import {Line} from 'react-chartjs-2'
import ReactSelect from '../components/ReactSelect'

function convertEpochToSpecificTimezone(unixtime){
    var s = new Date(unixtime)
    const humanDateFormat = s.toLocaleString()
    return humanDateFormat;
}

const daysoptions = [
    {
        value: 1,
        label: "1 day"
    },
    {
        value: 7,
        label: "7 days"
    },
    {
        value: 14,
        label: "14 days"
    },
    {
        value: 20,
        label: "20 days"
    },
    {
        value: 90,
        label: "90 days"
    },
]
export default class DetailedPage extends Component {
    constructor(){
        super();

        this.handleLogout = this.handleLogout.bind(this);
        this.Changedays = this.Changedays.bind(this);

        this.state = {
            username: '',
            news: [],
            news_status: '',
            currencyprice: '',
            days: 1,
            selecteddays: '1 day',
            chartpoints:{
                            labels: [],
                            datasets: [
                                {
                                    label: 'Price',
                                    backgroundColor: 'rgba(255,255,255,1)',
                                    borderColor: 'rgba(0,0,0,1)',
                                    borderWidth: 1,
                                    data: [],
                                    showLine: true
                                }
                            ]
                        }
        }
    }
    

    componentDidMount(){
        instance.get('/core/current_user/', {headers: {
            Authorization: `JWT ${localStorage.getItem('token')}`
        }}) 
        .then((res) => {
            this.setState({
                username: res.data.username,
                logged_in: localStorage.getItem('token') ? true : false,
            })
        })

        let charturl = '/coins/'+this.props.match.params.coin_name+'/market_chart/';

        coingekoinstance.get(charturl, {
                    params: {
                        vs_currency: 'inr',
                        days: 100
                    }  
                })
                .then((res)=> {
                    
                    const data = {...this.state.chartpoints.datasets[0], data: res.data.prices.map((price)=>{return(price[1]);})};
                    const newchart = {...this.state.chartpoints, labels: res.data.prices.map((price) => {
                        return (convertEpochToSpecificTimezone(price[0]));
                    }), datasets: [data]};

                    this.setState({
                        chartpoints: newchart
                    })
                });
        
        let coinpriceurl = '/simple/price';
        coingekoinstance.get(coinpriceurl, {
                    params: {
                        ids: this.props.match.params.coin_name,
                        vs_currencies: 'inr'
                    }  
                })
                .then((res) => {
                    console.log(res);
                    var name = this.props.match.params.coin_name
                    this.setState({
                        currencyprice: res.data[name].inr
                    })
                })

        newsapi.get('/top-headlines', {
                    params: {
                        q: this.props.match.params.coin_name,
                        apiKey: '4fd572ba75324d3483a269128c87730f'
                    }
                })
                .then((res) => {
                    if(res.data.articles.length) {
                        this.setState({
                            news: res.data.articles
                        })
                    }
                    else {
                        this.setState({
                            news_status: 'No News available'
                        })
                    }
                })

    }

    handleLogout() {
        localStorage.removeItem('token');
        this.setState({
            logged_in: false
        });
        return <Redirect to='/' />
    }

    Changedays = selecteddays => {
        this.setState({selecteddays})
        this.setState({
            days: Number(selecteddays.value)
        })

        let charturl = '/coins/'+this.props.match.params.coin_name+'/market_chart/';

        coingekoinstance.get(charturl, {
                    params: {
                        vs_currency: 'inr',
                        days: Number(selecteddays.value)
                    }  
                })
                .then((res)=> {
                    
                    const data = {...this.state.chartpoints.datasets[0], data: res.data.prices.map((price)=>{return(price[1]);})};
                    const newchart = {...this.state.chartpoints, labels: res.data.prices.map((price) => {
                        return (convertEpochToSpecificTimezone(price[0]));
                    }), datasets: [data]};

                    this.setState({
                        chartpoints: newchart
                    })
                });
    }

    render() {
        if(this.state.logged_in===false) {
            return <Redirect to='/' />
        }
        return (
            <div>
                <div> 
                    <div className="float-left">
                        <h4>Hi, {this.state.username}</h4>
                    </div>
                    <div className="float-right">
                        <Button variant="primary" onClick={this.handleLogout}>Logout</Button>{' '}
                    </div>
                </div>

                <div className="mb-5 pb-4"></div>

                <div className="mt-4" style={{clear: 'both'}}>
                    <div>
                        <span className="h4">{this.props.match.params.coin_name}:</span> INR {this.state.currencyprice}
                    </div>
                    <div>
                        <Line
                            
                                data={this.state.chartpoints}
                                options={
                                    
                                    {
                                        title:{
                                        display:false,
                                        text:'Cypto Price',
                                        fontSize:20
                                    },
                                    legend:{
                                        display:false,
                                        position:'right'
                                    },
                                    scales: {
                                        xAxes: [{
                                            ticks: {
                                                autoSkip: true,
                                                maxTicksLimit: 10
                                            }
                                        }]                                      
                                    },
                                    elements: {
                                        point:{
                                            radius: 0
                                        }
                                    }
                                }}
                            />
                    </div>
                </div>
                <div className="mt-5">
                    <Row>
                        <Col md="3">
                            <h5>Change Timeline:</h5>
                            <ReactSelect 
                                options= {daysoptions}
                                selectedOption = {this.state.selecteddays}
                                handleChange = {this.Changedays}
                            />
                        </Col>
                    </Row>
                    
                    {/* <Button variant="primary" onClick={this.Changedays}>7 Days</Button>{' '} */}
                </div>
                <div className="mt-4">
                    <h4 className="text-center">News</h4>
                    
                    <div className="mt-5">
                        <span className="text-danger">{this.state.news_status}</span>
                        <CardColumns>
                            {
                                this.state.news.map((post) => 
                                    <NewsCard 
                                        image = {post.urlToImage}
                                        title = {post.title}
                                        description = {post.description}
                                        author = {post.author}
                                        redirecturl= {post.url}
                                    />
                                )
                            }
                        </CardColumns>
                    </div>
                </div>
            </div>
        )
    }
}
