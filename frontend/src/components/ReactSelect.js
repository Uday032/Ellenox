import React, { Component } from 'react'
import Select from 'react-select';

export default class ReactSelect extends Component {
    render() {

        return (
        <Select
            
            value={this.props.selectedOption}
            onChange={this.props.handleChange}
            options={this.props.options}
        />
        );
    }
}
