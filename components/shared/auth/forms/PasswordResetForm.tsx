import React, {useEffect, useState} from "react";
import axios from "axios";
import Form from "react-jsonschema-form";
import {useParams, useLocation} from "react-router-dom";
import {Alert, Button, Col} from "react-bootstrap";
import {validateEmail} from "../../../../utils/utils";
import ErrorListTemplate from "./ErrorListTemplate";

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const validate = ({email, password, password_confirmation}, errors) => {
  if (!validateEmail(email)) {
    errors.email.addError(`${email} is not a valid email.`);
  }

  if (password !== password_confirmation) {
    errors.password_confirmation.addError("The passwords confirmation does not match.");
  }
  return errors;
};

const initialFormData = {
  schema: {
    type: "object",
    title: "",
    description: "",
    autoComplete: "off",
    isRequired: true,
    properties: {
      email: {
        type: "string",
        title: "Email",
        description: "",
      },
      password: {
        type: "string",
        title: "Password",
        description: "",
        minLength: 6,
        maxLength: 16
      },
      password_confirmation: {
        type: "string",
        title: "Confirm Password",
        description: "",
        minLength: 6,
        maxLength: 16
      }
    }
  },
  uiSchema: {
    email: {
      "ui:placeholder": "Enter your email",
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
    password_confirmation: {
      "ui:placeholder": "Confirm Password",
      "ui:widget": "password"
    },
  },
  formData: {
    email: '',
    password: '',
    password_confirmation: '',
  },
  extraErrors: {},
};

const PasswordResetForm = () => {
  const {token} = useParams();
  const query = useQuery();
  const email = query.get("email");
  const [form, setForm] = useState(initialFormData);
  const [showAlert, setShowAlert] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (email) {
      const formData = {...form.formData, email};
      setForm({...form, formData});
    }
  }, [email]);

  const signUp = (formData) => {
    axios.post('/password/reset', {...formData, token})
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
    <Col sm={{span: 8, offset: 2}}>
      <div className="form-title text-center">
        Reset password
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
        idPrefix={'reset-password-form'}
        className={"auth-form"}
        schema={form.schema}
        uiSchema={form.uiSchema}
        formData={form.formData}
        extraErrors={form.extraErrors}
        onChange={(formData) => {
          setForm({...form, ...formData});
        }}
        onSubmit={({formData}) => {
          signUp(formData);
        }}
        onError={(errors, val) => console.log('errors', {errors, val})}
        validate={validate}
        ErrorList={ErrorListTemplate}
      >
        <div className="form-actions">
          <Button variant="info" type="submit" className="submit-button">Reset password</Button>
        </div>
      </Form>
    </Col>
  )
};

export default PasswordResetForm;
