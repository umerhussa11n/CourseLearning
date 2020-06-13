import * as React from "react";
import {Col, Nav, Row, Tab} from "react-bootstrap";
import PasswordResetForm from "./forms/PasswordResetForm";
import './LoginTabs.scss';

export const PasswordReset = () => {
  return (
    <Col className="login-container">
      <Row className="justify-content-sm-center">
        <Col sm={8}>
          <div className="page-title text-center">Elenta.io</div>
          <PasswordResetForm/>
        </Col>
      </Row>
    </Col>
  );
};

export default PasswordReset;
