import React, {useState} from "react";
import axios from "axios";
import Form from "react-jsonschema-form";
import PropTypes from 'prop-types';
import {Alert, Button, Col, Modal} from "react-bootstrap";
import {validateEmail} from "../../../../utils/utils";
import ErrorListTemplate from "./ErrorListTemplate";

const validate = ({email}, errors) => {
  if (!validateEmail(email)) {
    errors.email.addError(`${email} is not a valid email.`);
  }
  return errors;
};

const loginFormData = {
  schema: {
    type: "object",
    title: "",
    description: "",
    autoComplete: "off",
    isRequired: true,
    properties: {
      email: {
        type: "string",
        title: "We will send new password to your e-mail",
        description: "",
      },
    }
  },
  uiSchema: {
    email: {
      "ui:placeholder": "Enter email",
      "ui:widget": "email",
      "ui:options": {
        inputType: 'email',
        autoComplete: 'off',
      }
    },
  },
  formData: {
    email: '',
  },
  extraErrors: {}
};

const ForgotPasswordModal = (props) => {
  const [form, setForm] = useState(loginFormData);
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const submitForm = (formData) => {
    axios.post('/password/email', formData)
      .then(function (response) {
        setShowSuccess(true);
      })
      .catch(function (error) {
        const errors = error.response.data.errors;
        // The extraErrors feature doesn't include in the version of 1.8.0.
        const extraErrors = Object.keys(errors).reduce((acc, error) => (
          {
            ...acc, [error]: {
              __errors: errors[error]
            }
          }
        ), {});
        setForm({...form, extraErrors});
        setErrors(errors);
        setShowAlert(true);
      });
  };

  return (
    <Modal show={props.show} onHide={() => props.onClose()}>
      <Modal.Header closeButton>
        <Modal.Title>Forgot Password?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showAlert &&
        <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
          {Object.keys(errors).map(error => (
            <div key={error}>
              {
                errors[error].map((message, index) => (
                  <p key={index}>
                    {message}
                  </p>
                ))
              }
            </div>
          ))}
        </Alert>
        }
        {showSuccess
          ? <div>
            <h3>Done</h3>
            Please check your email to reset the password
          </div>
          : <Form
            idPrefix={'log-in-form'}
            className={"auth-form"}
            showErrorList={false}
            schema={form.schema}
            uiSchema={form.uiSchema}
            formData={form.formData}
            extraErrors={form.extraErrors}
            onChange={(formData) => {
              setForm({...form, ...formData});
            }}
            onSubmit={({formData}) => {
              submitForm(formData);
            }}
            onError={(errors, val) => console.log('errors', {errors, val})}
            validate={validate}
            ErrorList={ErrorListTemplate}
          >
            <div className="form-actions">
              <Button variant="info" type="submit" className="submit-button">Send</Button>
            </div>

          </Form>
        }
      </Modal.Body>
    </Modal>
  )
};

ForgotPasswordModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ForgotPasswordModal;
