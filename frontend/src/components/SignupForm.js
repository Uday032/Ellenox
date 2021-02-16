import React, { Component } from 'react'

import {Form, Button, Row, Col} from 'react-bootstrap'
import {instance} from '../axios'

export default class SignupForm extends Component {
    constructor() {
        super();

        this.handlefirstNameChange = this.handlefirstNameChange.bind(this);
        this.handlelastNameChange = this.handlelastNameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleUserNameChange = this.handleUserNameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleConfirmPwdChange = this.handleConfirmPwdChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            firstname: '',
            lastname: '',
            email: '',
            username: '',
            password: '',
            cnfpassord: ''
        }
    }

    handlefirstNameChange(e) {
        this.setState({
            firstname: e.target.value
        })
    }

    handlelastNameChange(e) {
        this.setState({
            lastname: e.target.value
        })
    }

    handleUserNameChange(e) {
        this.setState({
            username: e.target.value
        })
    }

    handleEmailChange(e) {
        this.setState({
            email: e.target.value
        })
    }

    handlePasswordChange(e) {
        this.setState({
            password: e.target.value
        })
    }

    handleConfirmPwdChange(e) {
        this.setState({
            cnfpassord: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        const data = {
            'first_name': this.state.firstname,
            'last_name': this.state.lastname,
            'username': this.state.username,
            'email': this.state.email,
            'password': this.state.password
        }

        instance.post('/core/users/', data)
            .then((res)=>{
                localStorage.setItem('token', res.data.token);
                window.location.reload(false);
            })

    }


    render() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <h3 className="text-center">Sign Up</h3>
                <Row className="mt-5 justify-content-md-center">
                
                <Col xs={4} md={6}>

                    <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>FirstName</Form.Label>
                        <Form.Control
                        type="text" 
                        size="lg"
                        name="first_name"
                        value={this.state.firstname}
                        onChange={this.handlefirstNameChange}
                        placeholder="FirstName" 
                        required
                        />
                    </Form.Group>

                    <Form.Group as={Col}>
                        <Form.Label>LastName</Form.Label>
                        <Form.Control
                        type="text" 
                        size="lg"
                        name="last_name"
                        value={this.state.lastname}
                        onChange={this.handlelastNameChange}
                        placeholder="LastName" 
                        required
                        />
                    </Form.Group>
                    </Form.Row>

                    <Form.Group>
                        <Form.Label>Username:</Form.Label>
                        <Form.Control 
                            type="text"
                            size="lg"
                            name="email"
                            value={this.state.username}
                            onChange={this.handleUserNameChange}
                            placeholder="Enter username" 
                            required
                        />
                    </Form.Group>

                    <Form.Group>
                    <Form.Label>Email address</Form.Label>
                    <Form.Control 
                        type="email"
                        size="lg"
                        name="email"
                        value={this.state.email}
                        onChange={this.handleEmailChange}
                        placeholder="Enter Email" 
                        required
                    />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                    </Form.Group>

                    <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                        type="password" 
                        size="lg"
                        name="password"
                        value={this.state.password}
                        onChange={this.handlePasswordChange}
                        placeholder="Password" 
                        required
                        />
                    </Form.Group>

                    <Form.Group as={Col}>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                        type="password" 
                        size="lg"
                        name="confirmpassword"
                        value={this.state.cnfpassord}
                        onChange={this.handleConfirmPwdChange}
                        placeholder="Password" 
                        required
                        />
                    </Form.Group>
                    </Form.Row>

                    <Button variant="primary" type="submit">
                    Sign Up
                    </Button>
                </Col>
                </Row>
            </Form>
        )
    }
}
