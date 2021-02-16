import React, { Component } from 'react'
import {Button} from 'react-bootstrap'
import NewsCard from '../components/NewsHeadlineCard'
import { Redirect } from 'react-router-dom'
import {instance, coingekoinstance} from '../axios';
import {Line} from 'react-chartjs-2'

function convertEpochToSpecificTimezone(unixtime){
    var s = new Date(unixtime)
    const humanDateFormat = s.toLocaleString()
    return humanDateFormat;
}

export default class DetailedPage extends Component {
    constructor(){
        super();

        this.handleLogout = this.handleLogout.bind(this);

        this.state = {
            username: '',
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

    }

    handleLogout() {
        localStorage.removeItem('token');
        this.setState({
            logged_in: false
        });
        return <Redirect to='/' />
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
                        <span className="h4">{this.props.match.params.coin_name}:</span> $38,00
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

                <div className="mt-4">
                    <h4 className="text-center">News</h4>
                    <NewsCard />
                </div>
            </div>
        )
    }
}
