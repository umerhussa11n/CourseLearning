import * as React from "react";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import Form from "react-bootstrap/Form";
import {useMutation} from "@apollo/react-hooks";
import {CREATE_PROGRAM_INVITES} from "../../../../graphql/queries";
import {useContext, useState} from "react";
import LoadingContainer from "../../../hoc/LoadingContainer/LoadingContainer";
import {ToastContext} from "../../../../contexts/ToastContext";
import Button from "react-bootstrap/Button";
import _ from "lodash";

export const ProgramInviteTool = ({program, setProgram}) => {
  const [emails, setEmails] = useState("");
  const [runMutation, {loading: mutationLoading, error: mutationError, data: mutationData}] = useMutation(CREATE_PROGRAM_INVITES);

  const toastContext = useContext(ToastContext);

  const invite = () => {
    let vars = emails.split(",").map(e => {
      return {
        program: {
          connect: program.id
        },
        email: e,
        message: " "
      }
    });

    runMutation({
      variables: {input: vars}
    }).then(r => {
      toastContext.addToast({header: "Success!", body: "Invited"});
      let newState = _.cloneDeep(program);
      newState.invites = [...newState.invites, ...r.data.createProgramInvites];
      setProgram(newState);
    });
  };

  const handleChange = (e) => {
    setEmails(e.target.value);
  };

  return (
    <LoadingContainer
      loading={mutationLoading}
      error={mutationError}
    >
      <Form.Group>
        <Form.Label>Invite your learners to join by email. Add their addresses separated with a comma.</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={emails}
          onChange={handleChange}
          placeholder="e.g. justin@elenta.io, anshul@elenta.io, michael@elenta.io"
        />
      </Form.Group>
      <Button onClick={invite}>Invite</Button>
    </LoadingContainer>
  );
};

export default ProgramInviteTool;
