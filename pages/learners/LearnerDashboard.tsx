import * as React from "react";
import {useQuery} from '@apollo/react-hooks';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import LoadingContainer from "../../components/hoc/LoadingContainer/LoadingContainer";
import {CURRENT_USER, GET_LEARNER_PROFILE} from "../../graphql/queries";
import ProgramList from "../../components/learners/ProgramList/ProgramList";
import ProgramInviteList from "../../components/learners/ProgramInviteList/ProgramInviteList";

export const LearnerDashboard = () => {
  const {data: {user}} = useQuery(CURRENT_USER);

  const {loading, error, data} = useQuery(GET_LEARNER_PROFILE, {
    variables: {user_id: user.id},
  });

  return (
    <LoadingContainer loading={loading} error={error}>
      {data &&
      <div>
        {data.getLearnerProfile.programs &&
        <Container className="pb-4">
          <Row>
            <Col md={6}>
              <h3>Programs</h3>
            </Col>
          </Row>
          <hr/>
          <ProgramList
            programs={data.getLearnerProfile.programs}
          />
        </Container>
        }
        {data.getLearnerProfile.programInvites.length > 0 &&
        <Container className="pb-4">
          <Row>
            <Col md={6}>
              <h3>Program Invitations</h3>
            </Col>
          </Row>
          <hr/>
          <ProgramInviteList
            invites={data.getLearnerProfile.programInvites}
          />
        </Container>
        }
      </div>
      }
    </LoadingContainer>
  )
};

export default LearnerDashboard;
