import * as React from "react";
import {useQuery} from '@apollo/react-hooks';
import {CURRENT_USER} from "../../graphql/queries";
import {Redirect} from "react-router-dom";
import PasswordReset from "../../components/shared/auth/PasswordReset";

export const PasswordResetPage = () => {
  const {data: {user}} = useQuery(CURRENT_USER);

  if (user) return (<Redirect to="/dashboard"/>);

  return (
    <PasswordReset/>
  );
};

export default PasswordResetPage;
