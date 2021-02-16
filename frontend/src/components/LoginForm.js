import React, { Component } from 'react'
import {Form, Button, Row, Col} from 'react-bootstrap'
import {instance} from '../axios'

export default class LoginForm extends Component {
    constructor() {
        super();

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlepasswordChange = this.handlepasswordChange.bind(this);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);

        this.state = {
            username: '',
            password: '',
            logged_in: false
        }
    }

    handleUsernameChange(e) {
        this.setState({
            username: e.target.value
        })
    }

    handlepasswordChange(e) {
        this.setState({
            password: e.target.value
        })
    }

    handleOnSubmit(e) {
        e.preventDefault();
        const data = {
            "username": this.state.username,
            "password": this.state.password
        }

        instance.post('/core/loginuser/', data)
            .then((res) => {
                console.log(res);
                localStorage.setItem('token', res.data.token);
                window.location.reload(false);
            })
    }

    render() {
        
        return (
            <Form className="mt-5" onSubmit={this.handleOnSubmit}>
                <h3 className="text-center">Log In</h3>
                <Row className="mt-5 justify-content-md-center">
                
                <Col xs={4} md={6}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Enter Username</Form.Label>
                        <Form.Control 
                        type="text"
                        size="lg"
                        name="username"
                        value = {this.state.username}
                        onChange = {this.handleUsernameChange}
                        placeholder="Enter Username" 
                        required
                        />
                        <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        size="lg"
                        name="password"
                        value = {this.state.password}
                        onChange = {this.handlepasswordChange}
                        placeholder="Password" 
                        required
                    />
                    </Form.Group>

                    <Button variant="primary" className="mt-3" type="submit">
                    Login
                    </Button>
                </Col>
                </Row>
            </Form>
        )
    }
}
