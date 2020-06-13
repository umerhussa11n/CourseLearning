import * as React from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import {Link} from "react-router-dom";

export const TemplateTable = ({templates}) => {
  if (templates && templates.length > 0) {
    const columns = [
      {dataField: 'title', text: 'Name'},
      //{dataField: 'request_count', text: 'Requests'},
      //{dataField: 'program_count', text: 'Programs'},
      {dataField: 'is_public', text: 'Public'},
      {dataField: 'can_request', text: 'Requestable'}
    ];

    let tableData = templates.map(t => {
      return {
        'id': t.id,
        'title': <Link to={`/template/content/${t.id}`}>{t.title}</Link>,
        'is_public': t.is_public ? "Yes" : "No",
        'can_request': t.can_request ? "Yes" : "No"
      };
    });

    return <BootstrapTable keyField='id' data={tableData} columns={columns} />
  } else {
    return (
      <Alert variant="info">
        Create your first template
        <Link to="/template/settings/new"> here</Link>
      </Alert>
    );
  }
};

export default TemplateTable;
