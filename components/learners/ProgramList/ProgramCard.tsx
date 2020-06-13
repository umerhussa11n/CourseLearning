import * as React from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import {Card} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {formatDate} from "../../../utils/utils";
import {Link} from "react-router-dom";
import "./ProgramCard.scss";

// TODO pull styles out in CSS and/or other components
export const ProgramCard = ({program}) => {
  return (
    <Card className="program-card" style={{
      maxWidth: "23rem"
    }}>
      <Card.Header>
        <Link to={`/program/respond/${program.id}`}>{program.title}</Link>
      </Card.Header>
      <Card.Body>
        <Container className="pl-0 pr-0 pb-3">
          <h6 className="text-muted">Format</h6>
          <Card.Subtitle className="text-capitalize">
            {program.format.replace('_', ' ').toLowerCase()}
          </Card.Subtitle>
        </Container>
        <Container className="pl-0 pr-0 pb-3">
          <Row>
            <Col>
              <div className="text-muted">Start Date</div>
              <Card.Text>{formatDate(program.start_timestamp)}</Card.Text>
            </Col>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
};

export default ProgramCard;
