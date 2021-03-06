import * as React from "react";
import {
  CURRENT_USER,
  GET_CONSULTANT_PROFILE,
  UPDATE_CONSULTANT_PROFILE,
} from "../../graphql/queries";
import {useApolloClient, useQuery} from "@apollo/react-hooks";
import {get, pick} from "lodash";
import LoadingContainer from "../../components/hoc/LoadingContainer/LoadingContainer";
import ElentaForm from "../../components/shared/ElentaForm/ElentaForm";
import {validateEmail} from "../../utils/utils";
import { useHistory } from "react-router-dom";

const validate = ({profile: {userData: {email}}, passwords: {old_password, password, password_confirmation}}, errors) => {
  if (!validateEmail(email)) {
    errors.profile.userData.email.addError(`${email} is not a valid email.`);
  }

  if (old_password) {
    if (password !== password_confirmation) {
      errors.passwords.password_confirmation.addError("The passwords confirmation does not match.");
    }
  }

  return errors;
};

const schema = {
  title: "",
  type: "object",
  properties: {
    id: {
      type: "string"
    },

    profile: {
      title: "",
      type: "object",
      properties: {
        userData: {
          title: "",
          type: "object",
          properties: {
            picture_url: {
              type: "string",
              format: "data-url",
              title: " ",
            },

            name: {
              type: "string",
              title: "Name",
              description: "",
            },

            email: {
              type: "string",
              title: "Email",
              description: "",
            }
          }
        },

        profileData: {
          title: "",
          type: "object",
          properties: {
            title: {
              type: "string",
              title: "Title",
              description: "",
            },
            bio: {
              type: "string",
              title: "Biography",
              description: "",
            },
          }
        }
      },
    },

    passwords: {
      title: "Change Password",
      type: "object",
      properties: {
        old_password: {
          type: "string",
          title: "Enter current password",
          description: "",
          minLength: 6,
          maxLength: 16
        },
        password: {
          type: "string",
          title: "Enter new password",
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
  }
};

const uiSchema = {
  id: {
    "ui:widget": "hidden"
  },
  profile: {
    userData: {
      name: {
        "ui:placeholder": "Enter your name",
      },
      email: {
        "ui:placeholder": "Enter your email",
        "ui:widget": "email",
        "ui:options": {
          inputType: 'email',
          autoComplete: 'off',
        }
      },
    },
    profileData: {
      title: {
        "ui:placeholder": "Enter your profile name",
      },
      bio: {
        "ui:widget": "textarea",
        "ui:placeholder": "Enter your biography",
        "ui:options": {
          rows: 10
        }
      }
    }
  },
  passwords: {
    old_password: {
      "ui:placeholder": "Current password",
      "ui:widget": "password"
    },
    password: {
      "ui:placeholder": "Password",
      "ui:widget": "password"
    },
    password_confirmation: {
      "ui:placeholder": "Confirm Password",
      "ui:widget": "password"
    }
  },
};

export const ConsultantProfileSettingsPage = () => {
  const {data: {user}} = useQuery(CURRENT_USER);
  const client = useApolloClient();
  const history = useHistory();

  const {loading, error, data} = useQuery(GET_CONSULTANT_PROFILE, {
    variables: {user_id: user.id},
  });

  const consultantProfile = get(data, 'getConsultantProfile', {});

  schema.properties.profile.properties.userData.properties.picture_url["picture_url"] = consultantProfile.picture_url || null;
  schema.properties.profile.properties.userData.properties.name["default"] = user.name;
  schema.properties.profile.properties.profileData.properties.title["default"] = consultantProfile.title;
  schema.properties.profile.properties.profileData.properties.bio["default"] = consultantProfile.bio || "";

  schema.properties.profile.properties.userData.properties.email["default"] = user.email;

  return <LoadingContainer loading={loading} error={error}>
    <ElentaForm
      schema={schema}
      uiSchema={uiSchema}
      mutation={UPDATE_CONSULTANT_PROFILE}
      mutationVars={
        {
          id: consultantProfile.id,
          user_id: user.id
        }
      }
      mutationTransform={(d) => {
        Object.keys(d).map(section => {
          if (typeof d[section] === "object") {
            Object.keys(d[section]).map(prop => {
              if (typeof d[section][prop] === "object") {
                Object.keys(d[section][prop]).map(pr => {
                  d[pr] = d[section][prop][pr];
                });
              } else {
                d[prop] = d[section][prop];
              }
            });
            delete d[section];
          }
        });
      }}
      validate={validate}
      onSuccess={(data) => {
        const userProfile = get(data, 'updateConsultantProfile', null);
        client.writeData({
          data: {
            userProfile: {...userProfile, type: "consultantProfile"}
          }
        });
        history.push('/dashboard');
      }}
    />
  </LoadingContainer>
};

export default ConsultantProfileSettingsPage;
