import * as React from "react";
import {ModuleTrigger} from "../../../graphql/graphql-generated";
import ElentaJsonForm from "../../shared/ElentaJsonForm/ElentaJsonForm";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

const schema = {
  title: "Trigger",
  description: "Set when your module will be sent.",
  type: "object",
  required: ["frequency", "max_sends"],
  properties: {
    id: {
      type: "string"
    },
    start_timestamp: {
      type: "string",
      title: "Latest Start Time",
      dateFormat: true,
      timeFormat: true,
      format: "date-time"
    },
    start_timestamp_field: {
      type: "string",
      title: "Launch Date",
      enum: ["ENROL_TIME"],
      default: "ENROL_TIME",
      enumNames: ["Enrol Time"]
    },
    frequency: {
      type: "integer",
      title: "Number of days between sends",
      default: 1
    },
    max_sends: {
      type: "integer",
      title: "Total number of sends",
      default: 3
    }
  }
};

const uiSchema = {
  "ui:layout": [
    {
      start_timestamp_field: {md: 6},
      start_timestamp: {md: 6},
    },
    {
      frequency: {md: 6},
      max_sends: {md: 6}
    }
  ],
  id: {
    "ui:widget": "hidden"
  },
  start_timestamp: {
    "ui:widget": "RDP"
  },
  start_timestamp_field: {
    "ui:help": "Choose when you would like this module sent."
  },
  frequency: {
    "ui:help": "Set how many days you would like between sends."
  },
  max_sends: {
    "ui:help": "The module will stop being sent after this number."
  }
};

export const ModuleTriggerEditor: React.FunctionComponent<ModuleTriggerEditorProps> =
  ({
     trigger,
     onChange
   }) => {
    return (
      <Container>
          <ElentaJsonForm
            schema={schema}
            uiSchema={uiSchema}
            formData={trigger}
            onChange={onChange}
          />
      </Container>
    );
  };

interface ModuleTriggerEditorProps {
  trigger: ModuleTrigger,
  onChange: any
}

export default ModuleTriggerEditor;
