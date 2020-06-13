import * as React from "react";
import {Col, Image, Nav, Row, Tab} from "react-bootstrap";
import LoginForm from "./forms/LoginForm";
import SignUpForm from "./forms/SignUpForm";
import './LoginTabs.scss';

export const Login = () => {
  return (
    <Col className="login-container">
      <Row className="justify-content-sm-center">
        <Col sm={8}>
          <div className="page-title text-center">
            <Image src="/images/logo.png" alt="logo" style={{height: '70px'}}/>
          </div>
          <Tab.Container id="tabs-example" defaultActiveKey="log-in">
            <Row>
              <Col sm={12}>
                <Nav justify variant="tabs" className="">
                  <Nav.Item>
                    <Nav.Link eventKey="log-in">Log in</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="sign-up">Sign Up</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col sm={12}>
                <Tab.Content>
                  <Tab.Pane eventKey="log-in">
                    <LoginForm/>
                  </Tab.Pane>
                  <Tab.Pane eventKey="sign-up" title="Sign Up">
                    <SignUpForm/>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Col>
      </Row>
    </Col>
  );
};

export default Login;
