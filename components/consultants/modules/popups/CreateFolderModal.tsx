import React, {useState} from "react";
import Form from "react-jsonschema-form";
import PropTypes from 'prop-types';
import {Button, Modal} from "react-bootstrap";
import {get} from "lodash";
import ErrorListTemplate from "../../../shared/auth/forms/ErrorListTemplate";

const schema = {
  type: "object",
  title: "",
  description: "",
  autoComplete: "off",
  isRequired: true,
  properties: {
    folder: {
      type: "string",
      title: "Folder name",
      description: "",
    },
  }
};

const uiSchema = {
  folder: {
    "ui:placeholder": "Enter folder name",
  },
};

const CreateFolderModal = (props) => {
  const [formState, setFormState] = useState(null);

  return (
    <Modal show={true} onHide={() => props.onClose()}>
      <Modal.Header closeButton>
        <Modal.Title>Enter folder name</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          idPrefix={'create-folder'}
          className={"create-folder-form"}
          showErrorList={false}
          liveValidate={true}
          schema={schema}
          uiSchema={uiSchema}
          formData={formState}
          onChange={(data) => {
            setFormState({...formState, ...data.formData});
          }}
          onSubmit={({formData}) => {
            props.callback({...formData});
            props.onClose();
          }}
          onError={(errors, val) => console.log('errors', {errors, val})}
          ErrorList={ErrorListTemplate}
        >
          <div className="form-actions">
            <Button variant="info" type="submit" className="submit-button">Create</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
};

CreateFolderModal.propTypes = {
  editableFolder: PropTypes.object,
  callback: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreateFolderModal;
