import * as React from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import {Card} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {formatDate} from "../../../utils/utils";
import {Link} from "react-router-dom";

export const ProgramInviteCard = ({invite}) => {
  return (
    <Card className="program-card" style={{
      maxWidth: "23rem"
    }}>
      <Card.Header>
        <Link to={`/program/enrol/${invite.program.id}`}>Enrol in {invite.program.title}</Link>
      </Card.Header>
      <Card.Body>
        <Container className="pl-0 pr-0 pb-3">
          <h6 className="text-muted">Format</h6>
          <Card.Subtitle className="text-capitalize">
            {invite.program.format.replace('_', ' ').toLowerCase()}
          </Card.Subtitle>
        </Container>
        <Container className="pl-0 pr-0 pb-3">
          <Row>
            <Col>
              <div className="text-muted">Start Date</div>
              <Card.Text>{formatDate(invite.program.start_timestamp)}</Card.Text>
            </Col>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
};

export default ProgramInviteCard;
