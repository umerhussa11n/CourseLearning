import * as React from "react";
import { useQuery } from '@apollo/react-hooks';
import {CURRENT_USER} from "../../graphql/queries";
import {Redirect, Route} from "react-router-dom";

export const PrivateRoute = ({component: Component, ...rest}) => {
  const {data: {user}} = useQuery(CURRENT_USER);

  return (
    <Route {...rest}>
      {user ? <Component/> : <Redirect to="/login" />}
    </Route>
  );
};

export default PrivateRoute;
