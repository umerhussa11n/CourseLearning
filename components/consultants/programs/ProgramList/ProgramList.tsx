import * as React from "react";
import ProgramCard from "./ProgramCard";
import CardDeck from "react-bootstrap/CardDeck";
import Card from "react-bootstrap/Card";
import {Link} from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

export const ProgramList = ({programs}) => {
  if (programs && programs.length > 0) {
    return (
      <CardDeck>
        {
          programs.map(p => {
            return (
              <ProgramCard
                key={p.id}
                program={p}
              />
            );
          })
        }
      </CardDeck>
    );
  } else {
    return <Alert variant="info">
      It looks like you don't have any Programs yet, start by creating one
      <Link to="/program/settings/new"> here</Link>
    </Alert>
  }
};

export default ProgramList;
