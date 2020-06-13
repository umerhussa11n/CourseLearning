import * as React from "react";
import {useQuery} from '@apollo/react-hooks';
import {CURRENT_USER} from "../../graphql/queries";
import {Redirect, useLocation} from "react-router-dom";
import {Col} from "react-bootstrap";

export const NotFoundPage = () => {
  const location = useLocation();
  const {data: {user}} = useQuery(CURRENT_USER);

  if (user) return (<Redirect to="/dashboard"/>);

  return (
    <Col sm={{span: 8, offset: 2}}>
      <h3>Error 404</h3>
      <p>Hmmm, that page ({location.pathname}) does not exist...</p>
    </Col>
  );
};

export default NotFoundPage;
