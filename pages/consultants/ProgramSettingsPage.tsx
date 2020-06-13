import * as React from "react";
import {useParams, useHistory} from "react-router-dom";
import {
  CURRENT_USER_PROFILE,
  GET_PROGRAM,
  GET_TEMPLATES_BY_OWNER,
  UPSERT_PROGRAM,
} from "../../graphql/queries";
import {useLazyQuery, useMutation, useQuery} from "@apollo/react-hooks";
import {useContext, useEffect, useState} from "react";
import LoadingContainer from "../../components/hoc/LoadingContainer/LoadingContainer";
import Button from "react-bootstrap/Button";
import _ from "lodash";
import {ToastContext} from "../../contexts/ToastContext";
import {immutableMerge} from "../../utils/utils";
import ElentaJsonForm from "../../components/shared/ElentaJsonForm/ElentaJsonForm";
import {mutateTagData, tagUiSchema} from "../../components/tags/Tags";
import ArrayLayoutField from "../../components/shared/ElentaJsonForm/ArrayLayoutField";

const schema = {
  title: "Set up your program",
  type: "object",
  required: ["title", "description", "template", "format"],
  properties: {
    id: {
      type: "string"
    },
    title: {
      type: "string",
      title: "Title"
    },
    description: {
      type: "string",
      title: "Description",
    },
    template: {
      type: "string",
      title: "Template",
      enum: [],
      enumNames: [],
      default: ""
    },
    format: {
      type: "string",
      title: "Format",
      default: "SELF_DIRECTED",
      enum: ["SELF_DIRECTED", "IN_PERSON", "VIRTUAL_ATTENDANCE"],
      enumNames: ["Self Directed", "In Person", "Virtual Attendance"]
    },
    max_learners: {
      type: "integer",
      title: "Max Learners",
      default: 100
    },
    start_timestamp: {
      type: "string",
      title: "Start Date",
      dateFormat: true,
      timeFormat: true,
      format: "date-time"
    },
    can_invite: {
      type: "boolean",
      title: "Allow Sharing",
      default: false
    },
    is_public: {
      type: "boolean",
      title: "Listed publicly",
      default: false
    },
    company_attributes: {
      type: "object",
      properties: {
        company_name: {
          title: "Client Name",
          type: "string",
        },
        company_logo_url: {
          title: "Company Logo Url",
          type: "string",
        }
      }
    },
    recipient_lists: {
      type: "array",
      minItems: 1,
      title: "Select your participants",
      items: {
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          name: {
            type: "string",
            title: "Name"
          },
          channel: {
            type: "string",
            title: "Channel",
            default: "EMAIL",
            enum: ["EMAIL"],
            enumNames: ["Email"]
          },
          max_recipients: {
            type: "integer",
            default: 1000,
            title: "Max Recipients"
          }
        }
      },
      default: [
        {
          name: "Learners",
          channel: "EMAIL",
          max_recipients: 1000
        }
      ]
    },
    tags: {
      type: "array",
      title: "Tags",
      taggable: "program",
      items: {
        type: "string"
      }
    }
  }
};

const consistentUiSchema = {
  'ui:layout': [
    {
      title: {md: 6},
      template: {md: 6}
    },
    {
      format: {md: 6},
      description: {md: 6}
    }, {
      max_learners: {md: 6},
      start_timestamp: {md: 6}
    },
    {
      company_attributes: {md: 12}
    },
    {
      recipient_lists: {md: 12}
    },
    {
      can_invite: {md: 2},
      is_public: {md: 2},
    },
  ],
  id: {
    "ui:widget": "hidden"
  },
  title: {
    "ui:placeholder": "e.g. Executive Training Course for Company X"
  },
  description: {
    "ui:placeholder": "New Description",
    "ui:widget": "textarea",
    "ui:options": {
      rows: 1
    }
  },
  // TODO: maybe clean this up somehow, this one has a link so had to return jsx
  template: {
    "ui:help": (<p className="help-block">Select one of the templates you created, or <a href={"/template/settings/new"}>create a new template</a>.</p>)
  },
  format: {
    "ui:help": "Select the type of program."
  },
  company_attributes: {
    "ui:field": "companyLogoField"
  },
  can_invite: {
    "ui:widget": "hidden"
  },
  is_public: {
    "ui:widget": "hidden"
  },
  recipient_lists: {
    "ui:ArrayFieldTemplate": ArrayLayoutField({
      id: {
        "ui:widget": "hidden"
      },
      max_recipients: {
        "ui:widget": "hidden"
      },
      'ui:layout': [
        {
          id: {md: 0},
          name: {md: 6},
          channel: {md: 5},
          max_recipients: {md: 0}
        }
      ]
    })
  },
  ...tagUiSchema
}

const visibleUiSchema = {
  start_timestamp: {
    "ui:widget": "RDP"
  },
  max_learners: {
    "ui:widget": "updown"
  },
  ...consistentUiSchema
};

const hiddenUiSchema = {
  start_timestamp: {
    "ui:widget": "hidden"
  },
  max_learners: {
    "ui:widget": "hidden"
  },
  ...consistentUiSchema
};

const defaultDynamicFields = {
  schema: {
    type: "object",
    properties: {}
  },
  uiSchema: {
    "ui:order": []
  },
  formData: {}
};

export const ProgramSettingsPage = () => {
  let history = useHistory();
  let {id} = useParams();
  const {data: {userProfile}} = useQuery(CURRENT_USER_PROFILE);

  const [uiSchemaState, setUiSchemaState] = useState(hiddenUiSchema);
  const [schemaState, setSchemaState] = useState(immutableMerge(schema, {
    properties: {
      template: {
        readOnly: id !== "new"
      }
    }
  }));

  const [dynamicFields, setDynamicFields] = useState(defaultDynamicFields);
  const [formState, setFormState] = useState({
    template: null
  });

  const [runTemplatesQuery, {loading: templatesQueryLoading, error: templatesQueryError, data: templatesQueryData}] = useLazyQuery(GET_TEMPLATES_BY_OWNER);
  const [runProgramQuery, {loading: programQueryLoading, error: programQueryError, data: programQueryData}] = useLazyQuery(GET_PROGRAM);
  const [runMutation, {loading: mutationLoading, error: mutationError, data: mutationData}] = useMutation(UPSERT_PROGRAM);

  const toastContext = useContext(ToastContext);

  let formRef;

  useEffect(() => {
    if (!templatesQueryData && id == "new") {
      runTemplatesQuery({variables: {consultant_profile_id: userProfile.id}});
    }

    if (templatesQueryData) {
      setFormState(immutableMerge(formState, {
        template: templatesQueryData.getTemplatesByOwner[0].id
      }));

      setDynamicFields(JSON.parse(templatesQueryData.getTemplatesByOwner[0].dynamic_fields));

      setSchemaState(immutableMerge(
        schemaState,
        {
          properties: {
            template: {
              enum: templatesQueryData.getTemplatesByOwner.map(d => d.id),
              enumNames: templatesQueryData.getTemplatesByOwner.map(d => d.title),
              default: templatesQueryData.getTemplatesByOwner[0].id
            }
          }
        }
      ));
    }
  }, [templatesQueryData]);

  useEffect(() => {
    if (!programQueryData && id != "new") {
      runProgramQuery({variables: {id: id}});
    }

    if (programQueryData) {
      setSchemaState(immutableMerge(
        schemaState,
        {
          properties: {
            template: {
              enum: [programQueryData.getProgram.template.id],
              enumNames: [programQueryData.getProgram.template.title]
            }
          }
        }
      ));

      if (["IN_PERSON", "VIRTUAL_ATTENDANCE"].includes(programQueryData.getProgram.format)) {
        setUiSchemaState(immutableMerge(uiSchemaState, visibleUiSchema));
      } else {
        setUiSchemaState(immutableMerge(uiSchemaState, hiddenUiSchema));
      }

      let df = JSON.parse(programQueryData.getProgram.dynamic_fields);
      if (df.schema === undefined) {
        setDynamicFields(defaultDynamicFields);
      } else {
        setDynamicFields(df);
      }
      setFormState(immutableMerge(programQueryData.getProgram, {
        template: programQueryData.getProgram.template.id,
        recipient_lists: programQueryData.getProgram.recipientLists
      }))
    }
  }, [programQueryData]);

  const findTemplate = (template_id) => {
    if (templatesQueryData) {
      return templatesQueryData.getTemplatesByOwner.filter(t => t.id === template_id)[0]
    }
  }

  const handleChange = (data) => {
    let newState = immutableMerge(formState, data.formData);

    if ((id == "new") && (data.formData.template != formState.template)) {
      setDynamicFields(JSON.parse(findTemplate(data.formData.template).dynamic_fields));
    }

    if (!_.isEqual(newState, formState)) {
      setFormState(newState);
      if (["IN_PERSON", "VIRTUAL_ATTENDANCE"].includes(newState.format)) {
        setUiSchemaState(immutableMerge(uiSchemaState, visibleUiSchema));
      } else {
        setUiSchemaState(immutableMerge(uiSchemaState, hiddenUiSchema));
      }
    }
  };

  const handleDynamicChange = (f) => {
    let newState = immutableMerge(dynamicFields, {formData: f.formData})
    if (!_.isEqual(newState, dynamicFields)) {
      setDynamicFields(newState);
    }
  }

  const handleSubmit = () => {
    if (formRef.reportValidity()) {
      runMutation({
          variables: {
            input: immutableMerge(
              _.pick(formState, ['title', 'description', 'format', 'is_public', 'can_invite', 'max_learners']),
              {
                id: id == "new" ? null : id,
                template: {
                  connect: formState.template
                },
                dynamic_fields: JSON.stringify(dynamicFields),
                owner: {
                  connect: userProfile.id
                },
                company_name: _.result(formState, 'company_attributes.company_name'),
                company_logo_url: _.result(formState, 'company_attributes.company_logo_url'),
                tags: mutateTagData(_.result(formState, 'tags')),
                recipientLists: {
                  upsert: _.result(formState, 'recipient_lists').map(rl => {
                    return {
                      ..._.omit(rl, '__typename')
                    }
                  })
                }
              })
          }
        }
      ).then(r => {
        toastContext.addToast({header: "Success!", body: "Saved"});
        if (id == "new") {
          history.push(`/program/content/${r.data.upsertProgram.id}`);
        }
      });
    }
  };

  return (
    <LoadingContainer
      loading={[mutationLoading, templatesQueryLoading, programQueryLoading]}
      error={[mutationError, templatesQueryError, programQueryError]}
    >
      <ElentaJsonForm schema={schemaState}
                      uiSchema={uiSchemaState}
                      formData={_.pick(formState, Object.keys(schemaState.properties))}
                      onChange={handleChange}
                      ref={r => formRef = r}
      />
      {/*remove false to unhide*/}
      {false &&
        <ElentaJsonForm schema={dynamicFields.schema}
                        uiSchema={dynamicFields.uiSchema}
                        formData={dynamicFields.formData}
                        onChange={handleDynamicChange}
        />
      }
      <Button onClick={handleSubmit}>Submit</Button>
    </LoadingContainer>
  );
};

export default ProgramSettingsPage;
