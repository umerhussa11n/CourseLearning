import * as React from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {formatDate} from "../../../utils/utils";
import Alert from "react-bootstrap/Alert";

export const TemplateRequestTable = ({requests}) => {
  const columns = [
    {dataField: "email", text: "Email"},
    {dataField: "organization", text: "Organization"},
    {dataField: "comment", text: "Comment"}
  ];

  if (requests && requests.length) {
    return <BootstrapTable keyField='id' data={requests} columns={columns}/>
  } else {
    return (
      <Alert variant="info">
        This template doesn't have any requests right now
      </Alert>
    );
  }
};

export default TemplateRequestTable;
