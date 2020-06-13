import * as React from "react";
import BootstrapTable from 'react-bootstrap-table-next';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import * as moment from "moment";
import {formatDate} from "../../../utils/utils";
import Alert from "react-bootstrap/Alert";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";

export const ProgramLearnerTable = ({program}) => {
  if (program?.learners?.length > 0) {
    const columns = [
      {dataField: "name", text: "Name"},
      {dataField: "role", text: "Role"}
    ].concat(program.modules.map(m => {
      return {
        dataField: m.id,
        text: m.title
      };
    }));

    const sends = {};
    program.programModules.forEach(pm => {
      pm.sends.forEach(send => {
        if (send.learner) {
          sends[JSON.stringify([pm.module.id, send.learner.id])] = {
            send_timestamp: send.send_timestamp,
            open_timestamp: send.open_timestamp,
            click_timestamp: send.click_timestamp,
            response_timestamp: send.response_timestamp,
            response_feedback: send.response_feedback,
            response_rating: send.response_rating
          }
        }
      });
    });

    const tableData = program.learners.map(l => {
      let obj = {
        "name": l.user.name,
        "role": l.role,
      };

      program.modules.forEach(m => {
        let send = sends[JSON.stringify([m.id, l.id])];
        if (send) {
          if (send.response_timestamp) {
            // TODO change to thumb up/down icon in red or green
            obj[m.id] = (<p>
              Completed on {formatDate(send.response_timestamp)}, with a rating
              of
              {send.response_rating === 0 &&
              <i className="fas fa-thumbs-down btn-danger ml-2"/>
              }
              {send.response_rating === 1 &&
              <i className="fas fa-thumbs-up btn-success ml-2"/>
              }
            </p>)
          } else if (send.click_timestamp) {
            obj[m.id] = <p>Clicked on {formatDate(send.click_timestamp)}</p>
          } else if (send.open_timestamp) {
            obj[m.id] = <p>Opened on {formatDate(send.open_timestamp)}</p>
          } else if (send.send_timestamp) {
            obj[m.id] = <p>Sent on {formatDate(send.send_timestamp)}</p>
          } else {
            obj[m.id] = <p>Not sent yet</p>
          }

          // if (!send.response_timestamp && moment().diff(moment(send.send_timestamp), 'days') >= 2) {
          //   obj[m.id].style = "{'color': 'red'}";
          // }
        }
      });
      return obj;
    });

    return <BootstrapTable keyField='id' data={tableData} columns={columns}/>
  } else {
    return <Alert variant="info">
      It looks like you don't have any learners yet
    </Alert>
  }
};

export default ProgramLearnerTable;
