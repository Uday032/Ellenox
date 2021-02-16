import React, { Component } from 'react'
import {Button} from 'react-bootstrap'
import {Link} from 'react-router-dom';

export default class WatchListTableData extends Component {

    render() {
        return (
            <tr>
                <td><Link to={"/detailedpage/"+this.props.Cryptoname}>{this.props.Cryptoname}</Link></td>
                <td>{this.props.price}</td>
                <td>{this.props.percentday}</td>
                <td>{this.props.daychange}</td>
                <td>{this.props.chart}</td>
                <td><Button delete-link={this.props.deletelink} onClick={this.props.handleDelete} variant="primary">Delete</Button></td>
            </tr>
        )
    }
}
