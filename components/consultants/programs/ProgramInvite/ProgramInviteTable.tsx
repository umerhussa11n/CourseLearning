import * as React from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {formatDate} from "../../../../utils/utils";
import Alert from "react-bootstrap/Alert";

export const ProgramInviteTable = ({invites}) => {
  if (invites?.length > 0) {
    const columns = [
      {dataField: "email", text: "Email"},
      {dataField: "invited_at", text: "Sent"},
      {dataField: "enrolled", text: "Invitation Accepted?"}
    ];

    let tableData = invites.map(i => {
      return {
        email: i.email,
        invited_at: formatDate(i.created_at),
        enrolled: (i.learner && i.learner.id) ? "Yes" : "No"
      };
    });
    return <BootstrapTable keyField='id' data={tableData} columns={columns}/>
  }
  else {
    return <Alert variant="info">
      It looks like you don't have any invites yet, start by using the tool above
    </Alert>
  }

};

export default ProgramInviteTable;
