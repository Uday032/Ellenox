import React, { Component } from 'react'
import {Card} from 'react-bootstrap'


export default class NewsHeadlineCard extends Component {
    render() {
        return (
            <Card>
                <Card.Img variant="top" src={this.props.image} />
                <Card.Body>
                <Card.Title>{this.props.title}</Card.Title>
                <Card.Text>
                    {this.props.description}
                    <a href={this.props.redirecturl} target="_blank">view more...</a>
                </Card.Text>
                </Card.Body>
                <Card.Footer>
                <small className="text-muted">Posted by {this.props.author}</small>
                </Card.Footer>
            </Card>
        )
    }
}
