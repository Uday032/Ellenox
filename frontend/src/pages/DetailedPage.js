import React, { Component } from 'react'
import NewsCard from '../components/NewsHeadlineCard'

export default class DetailedPage extends Component {
    render() {
        return (
            <div>
                <div>
                    <h3>News</h3>
                    <div className="mt-4">
                        <NewsCard />
                    </div>
                </div>
            </div>
        )
    }
}
