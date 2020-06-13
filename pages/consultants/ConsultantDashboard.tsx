import * as React from "react";
import {useQuery} from '@apollo/react-hooks';
import {gql} from 'apollo-boost';
import Spinner from "react-bootstrap/Spinner";
import {Link, Redirect, useParams} from "react-router-dom";
import ModuleList from "../../components/consultants/modules/ModuleList";
import {useState} from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ElentaFormBuilder from "../../components/consultants/ElentaFormBuilder/ElentaFormBuilder";
import TemplateTable from "../../components/consultants/templates/TemplateTable";
import ProgramList from "../../components/consultants/programs/ProgramList/ProgramList";
import LoadingContainer from "../../components/hoc/LoadingContainer/LoadingContainer";
import {CURRENT_USER, GET_CONSULTANT_PROFILE} from "../../graphql/queries";
import Button from "react-bootstrap/Button";

export const ConsultantDashboard = () => {
  const {data: {user}} = useQuery(CURRENT_USER);

  const {loading, error, data} = useQuery(GET_CONSULTANT_PROFILE, {
    variables: {user_id: user.id},
  });

  return (
    <LoadingContainer loading={loading} error={error}>
      {data &&
      <div>
        {data.getConsultantProfile.templates.length > 0 &&
        <Container className="pb-4">
          <Row>
            <Col md={6}>
              <h3>Programs</h3>
            </Col>
            <Col>
              <Link to='/program/settings/new' className='float-right'><Button>Create Program</Button></Link>
            </Col>
          </Row>
          <hr/>
          <ProgramList
            programs={data.getConsultantProfile.programs}
          />
        </Container>
        }
        <Container>
          <Row>
            <Col md={6}>
              <h3>Templates</h3>
            </Col>
            <Col>
              <Link to='/template/settings/new' className='float-right'><Button>Create Template</Button></Link>
            </Col>
          </Row>
          <hr/>
          <TemplateTable
            templates={data.getConsultantProfile.templates}
          />
        </Container>
      </div>
      }
    </LoadingContainer>
  )
};

export default ConsultantDashboard;
