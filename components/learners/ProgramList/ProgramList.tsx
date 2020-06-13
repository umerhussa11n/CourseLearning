import * as React from "react";
import ProgramCard from "./ProgramCard";
import CardDeck from "react-bootstrap/CardDeck";
import Alert from "react-bootstrap/Alert";

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
    // TODO: Add free, public programs
    return <Alert variant="info">
      It looks like you aren't enrolled in any Programs yet
    </Alert>
  }
};

export default ProgramList;
