import React, {useState} from "react";
import axios from "axios";
import Form from "react-jsonschema-form";
import {Alert, Button, Col} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import {validateEmail} from "../../../../utils/utils";
import ErrorListTemplate from "./ErrorListTemplate";
import ForgotPasswordModal from "./ForgotPasswordModal";

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
    required: [
      "email",
      "password"
    ],
    properties: {
      email: {
        type: "string",
        title: "Login",
        description: "",
      },
      password: {
        type: "string",
        title: "Password",
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
    password: {
      "ui:placeholder": "Password",
      "ui:widget": "password"
    },
  },
  formData: {
    email: '',
    password: '',
  },
  extraErrors: {}
};

const LoginForm = () => {
  const [form, setForm] = useState(loginFormData);
  const [showAlert, setShowAlert] = useState(false);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  const login = (formData) => {
    axios.post('/login', formData)
      .then(function (response) {
        localStorage.setItem('token', response.data.token);
        window.location.reload();
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
    <>
      <Col sm={{span: 8, offset: 2}}>
        <div className="form-title text-center">
          Log in
        </div>
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
        <Form
          idPrefix={'log-in-form'}
          className={"auth-form"}
          schema={form.schema}
          uiSchema={form.uiSchema}
          formData={form.formData}
          extraErrors={form.extraErrors}
          onChange={(formData) => {
            setForm({...form, ...formData});
          }}
          onSubmit={({formData}) => {
            login(formData);
          }}
          onError={(errors, val) => console.log('errors', {errors, val})}
          validate={validate}
          ErrorList={ErrorListTemplate}
        >
          <div className="login-actions">
            <a className="active" href="#"
               onClick={(e) => {
                 e.preventDefault();
                 setShowModal(true);
               }}>
              Forgot the password?
            </a>
            <Button variant="info" type="submit" className="submit-button">Log In</Button>
          </div>
        </Form>
        {/*to unhide remove false*/}
        {false &&
          <div className="form-actions">
            <div className="title">
              <span>
                or log in with
              </span>
            </div>
            <div className="social-buttons">
              <a href="/login/google" className="btn btn-outline-info">
                <i className="fab fa-google"/> Google
              </a>
              <a href="/login/linkedin" className="btn btn-outline-info">
                <i className="fab fa-linkedin-in"/> Linkedin
              </a>
            </div>
          </div>
        }
      </Col>
      <ForgotPasswordModal show={showModal} onClose={setShowModal}/>
    </>
  )
};

LoginForm.propTypes = {};

export default LoginForm;
