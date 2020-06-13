import * as React from "react";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import "./LoadingContainer.scss";

export const LoadingContainer = (props) => {
  let isLoading = props.loading;
  if (Array.isArray(props.loading)) {
    isLoading = props.loading.reduce((p, c) => p || c);
  }

  let errorKey = "message";
  if (window.location.hostname !== "app.elenta.io") {
    errorKey = "debugMessage";
  }
  let errors = [];
  if (Array.isArray(props.error)) {
    errors = props.error.filter(e => e !== undefined).map(es => {
      return es.graphQLErrors.map(e => e[errorKey]);
    }).flat();
  } else if (props.error) {
    errors = props.error.graphQLErrors.map(e => e[errorKey]);
  }

  if (isLoading) return (
    <Container className="loading-container">
      <div className="wrapper">
        <div className="overlay">
          <Spinner className="loading-spinner" animation="border"/>
        </div>
        {props.children}
      </div>
    </Container>
  );

  if (errors.length > 0) return (
    <Container className="loading-container">
      <div className="wrapper">
        <div className="overlay" style={{background: "red", opacity: 0.9}}>
          {
            errors.map(e => {
              return <p key={e}>{e}</p>
            })
          }
        </div>
        {props.children}
      </div>
    </Container>
  );

  return (
    <Container>
      {props.children}
    </Container>
  );
};

export default LoadingContainer;
