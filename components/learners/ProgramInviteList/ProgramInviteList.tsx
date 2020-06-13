import * as React from "react";
import CardDeck from "react-bootstrap/CardDeck";
import ProgramInviteCard from "./ProgramInviteCard";


export const ProgramInviteList = ({invites}) => {
  return (
    <CardDeck>
      {
        invites.map(i => {
          return (
            <ProgramInviteCard
              key={i.id}
              invite={i}
            />
          );
        })
      }
    </CardDeck>
  );
};

export default ProgramInviteList;
