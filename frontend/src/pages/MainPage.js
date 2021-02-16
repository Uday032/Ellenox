import React, { Component } from 'react'
import {Nav, Tab} from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
import LoginForm from '../components/LoginForm'
import SignupForm from '../components/SignupForm'

export default class MainPage extends Component {
    constructor(){
        super();
        this.state = {
            logged_in: localStorage.getItem('token') ? true : false
        }
    }

    render() {
        if(this.state.logged_in) {
            return <Redirect to='/watchlist' />
        }
        return (
            <div>
                <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                    <Nav variant="pills" className="row">
                        <Nav.Item>
                        <Nav.Link eventKey="first">Login</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                        <Nav.Link eventKey="second">Signup</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Tab.Content>
                        <Tab.Pane eventKey="first">
                        <LoginForm />
                        </Tab.Pane>
                        <Tab.Pane eventKey="second">
                        <SignupForm />
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </div>
        )
    }
}
