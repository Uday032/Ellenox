import React, { Component } from 'react'
import {Table, Button} from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
import {Line} from 'react-chartjs-2'
import {instance, coingekoinstance} from '../axios';

import ReactSelect from '../components/ReactSelect'
import WatchListData from '../components/WatchListTableData'

export default class WatchList extends Component {

    constructor() {
        super();

        this.handleCryptoChange = this.handleCryptoChange.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        this.state = {
            cryptos: [],
            selectedoption: '',
            selectedoption: '',
            logged_in: localStorage.getItem('token') ? true : false,
            username: '',
            watchlistcryptos: [],
            success: '',
            error: ''
        };
    }
    
    componentDidMount() {
        instance.get('/core/current_user/', {headers: {
            Authorization: `JWT ${localStorage.getItem('token')}`
        }}) 
        .then((res) => {
            this.setState({
                username: res.data.username
            })
        })

        instance.get('/core/cryptos/', {headers: {
            Authorization: `JWT ${localStorage.getItem('token')}`
        }})
        .then((response) => {
            if(response.data.length>0){
                for(var i=0;i<response.data.length;i++) {
                    coingekoinstance.get('/coins/markets/',{
                            params: {
                                vs_currency: 'inr',
                                ids: response.data[i].coinid,
                                order: 'market_cap_desc',
                                per_page: '100',
                                page: '1',
                                sparkline: 'true',
                                price_change_percentage: '24h'
                            }
                        })
                        .then((res) => {
                            console.log(res.data[0].sparkline_in_7d.price.length);
                            let addwatchlist = {
                                'id': res.data[0].id,
                                'price': res.data[0].current_price,
                                'percentage_day_change': res.data[0].price_change_percentage_24h,
                                'daychange': res.data[0].price_change_24h,
                                // 'chartpoints': res.data[0].sparkline_in_7d,
                                'chartpoints': {
                                    labels: Array.from(Array(res.data[0].sparkline_in_7d.price.length).keys()),
                                    datasets: [
                                        {
                                            label: 'Rainfall',
                                            backgroundColor: 'rgba(255,255,255,1)',
                                            borderColor: 'rgba(0,0,0,1)',
                                            borderWidth: 1,
                                            data: res.data[0].sparkline_in_7d.price,
                                            showLine: true
                                        }
                                    ]
                                }
                            }

                            this.setState({
                                watchlistcryptos: [...this.state.watchlistcryptos, addwatchlist]
                            })
                        })
                        
                }
            }
        })

        coingekoinstance.get('/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=20&page=1&sparkline=false')
            .then((res) => {
                if(res.data.length > 0) {
                    this.setState({
                        cryptos: res.data.map(function(crypto){
                            return {
                                value: crypto.id,
                                label: crypto.id
                            }
                        })
                    })
                }
            })
    }

    handleCryptoChange = selectedoption => {
        this.setState({selectedoption});
        const data= {
            "coinid" : selectedoption.value,
            "userid" : this.state.username 
        }
        instance.post('/core/cryptos/', data)
            .then((res)=> {
                if(res.data.error) {
                    this.setState({
                        error: res.data.error,
                        success: ''
                    })
                }
                else {
                    this.setState({
                        success: 'Added to watchlist',
                        error: ''
                    })
                    window.location.reload(false);
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

    handleDelete(e){
        e.preventDefault();

        const data = {
            "coinid": e.target.getAttribute("delete-link"),
            "userid": this.state.username
        }

        instance.post('/core/cryptos/delete/', data)
            .then((res) => {
                window.location.reload(false);
            })
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
                
                <div className="mb-5" style={{clear:'both'}}>
                    <h6>Add Cryptocurrency: </h6>
                    <ReactSelect 
                       selectedOption = {this.state.selectedoption}
                       handleChange = {this.handleCryptoChange}
                       options = {this.state.cryptos}
                    />
                    <div>
                        <span className="text-success">{this.state.success}</span>
                        <span className="text-danger">{this.state.error}</span>
                    </div>
                </div>
                <h3 className="text-center">Watch List</h3>
                <div className="mt-5">
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Percent(Day Change)</th>
                                <th>Day Change</th>
                                <th>Chart</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.watchlistcryptos.map((crypto) => {
                                        console.log(crypto);
                                        return(
                                        <WatchListData
                                            key= {crypto.id}
                                            Cryptoname={crypto.id}
                                            price = {crypto.price}
                                            percentday={crypto.percentage_day_change+"%"}
                                            daychange={crypto.daychange}
                                            handleDelete= {this.handleDelete}
                                            deletelink = {crypto.id}
                                            chart= {
                                                <Line
                                                
                                                    data={crypto.chartpoints}
                                                    options={
                                                        
                                                        {
                                                            title:{
                                                            display:false,
                                                            text:'Average Rainfall per month',
                                                            fontSize:20
                                                        },
                                                        legend:{
                                                            display:false,
                                                            position:'right'
                                                        },
                                                        scales: {
                                                            xAxes: [{
                                                                ticks: {
                                                                    display: false
                                                                },
                                                                gridLines: {
                                                                    display: false,
                                                                },
                                                            }],
                                                            yAxes: [{
                                                                ticks: {
                                                                    display: false
                                                                },
                                                                gridLines: {
                                                                    display: false,
                                                                },
                                                            }]
                                                        },
                                                        elements: {
                                                            point:{
                                                                radius: 0
                                                            }
                                                        }
                                                    }}
                                                    width= {70} 
                                                    height= {20}
                                                />
                                            }
                                        />
                                        );
                                    }
                                )
                            }
                        </tbody>
                    </Table>
                </div>
            </div>
        )
    }
}
