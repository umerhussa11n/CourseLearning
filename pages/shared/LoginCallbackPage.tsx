import React, {useEffect} from "react";
import {useQuery} from '@apollo/react-hooks';
import {useParams, Redirect} from "react-router-dom";
import {Container, Spinner} from "react-bootstrap";
import {CURRENT_USER, CURRENT_USER_PROFILE} from "../../graphql/queries";
import LoadingContainer from "../../components/hoc/LoadingContainer/LoadingContainer";
import {ElentaClient} from "../../app";

export const LoginCallbackPage = () => {
  const {token} = useParams();
  const storageToken = localStorage.getItem('token');
  const {data: {user}} = useQuery(CURRENT_USER);
  const {data: {userProfile}} = useQuery(CURRENT_USER_PROFILE);

  if (user) {
    if (!userProfile.picture_url) {
      return (<Redirect to="/preferences"/>);
    }
    return (<Redirect to="/dashboard"/>);
  }

  useEffect(() => {
    if (token && token !== storageToken) {
      localStorage.setItem('token', token);
      window.location.reload();
    }
  }, [token, storageToken]);

  return (
    <LoadingContainer loading={true}/>
  );
};

export default LoginCallbackPage;
