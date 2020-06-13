import * as React from "react";
import {useParams, useHistory} from "react-router-dom";
import {CURRENT_USER_PROFILE, GET_TEMPLATE, UPSERT_TEMPLATE} from "../../graphql/queries";
import {useLazyQuery, useMutation, useQuery} from "@apollo/react-hooks";
import ElentaFormBuilder from "../../components/consultants/ElentaFormBuilder/ElentaFormBuilder";
import {useContext, useEffect, useState} from "react";
import LoadingContainer from "../../components/hoc/LoadingContainer/LoadingContainer";
import Button from "react-bootstrap/Button";
import _ from "lodash";
import {ToastContext} from "../../contexts/ToastContext";
import {immutableMerge} from "../../utils/utils";
import {mutateTagData, tagUiSchema} from "../../components/tags/Tags";
import ElentaJsonForm from "../../components/shared/ElentaJsonForm/ElentaJsonForm";
import Container from "react-bootstrap/Container";
import ArrayLayoutField from "../../components/shared/ElentaJsonForm/ArrayLayoutField";

const schema = {
  title: "Create Template",
  description: "A template is base for your programs, a collection of content, quizzes and follow ups that you can send to learners.",
  type: "object",
  required: ["title", "description", "recipient_lists", "can_request", "is_public"],
  properties: {
    id: {
      type: "string"
    },
    title: {
      type: "string",
      title: "Title",
    },
    description: {
      type: "string",
      title: "Description",
    },
    can_request: {
      type: "boolean",
      title: "Allow Requests",
      default: true
    },
    is_public: {
      type: "boolean",
      title: "Share publicly",
      default: false
    },
    dynamic_fields: {
      type: "string"
    },
    recipient_lists: {
      type: "array",
      minItems: 1,
      title: "Recipient Lists",
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
      taggable: "template",
      items: {
        type: "string"
      }
    }
  }
};

const uiSchema = {
  'ui:layout': [
    {
      title: {md: 6},
      description: {md: 6}
    },
    {
      can_request: {md: 2},
      is_public: {md: 2},
    },
    {
      recipient_lists: {md: 12}
    }
  ],
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
  id: {
    "ui:widget": "hidden"
  },
  title: {
    "ui:placeholder": "e.g. Sales Training Course"
  },
  description: {
    "ui:widget": "textarea",
    "ui:placeholder": "e.g. Sales training program for corporate clients",
    "ui:options": {
      rows: 1
    }
  },
  dynamic_fields: {
    "ui:widget": "hidden"
  },
  can_request: {
    "ui:widget": "hidden"
  },
  is_public: {
    "ui:widget": "hidden"
  },
  ...tagUiSchema
};

const defaultDynamicFields = {
  schema: {
    type: "object",
    properties: {}
  },
  uiSchema: {
    "ui:order": []
  }
};

export const TemplateSettingsPage = () => {
  let history = useHistory();
  let {id} = useParams();
  if (id !== "new") {
    schema.title = "Update Template";
  }
  const {data: {userProfile}} = useQuery(CURRENT_USER_PROFILE);

  const [formState, setFormState] = useState({
    dynamic_fields: defaultDynamicFields
  });

  const [runQuery, {loading: queryLoading, error: queryError, data: queryData}] = useLazyQuery(GET_TEMPLATE);
  const [runMutation, {loading: mutationLoading, error: mutationError, data: mutationData}] = useMutation(UPSERT_TEMPLATE);

  const toastContext = useContext(ToastContext);

  let formRef;

  useEffect(() => {
    if (!queryData && id != "new") {
      runQuery({variables: {id: id}});
    }

    if (queryData) {
      let dynamicFields = JSON.parse(queryData.getTemplate.dynamic_fields);
      if (dynamicFields.schema === undefined) {
        dynamicFields = defaultDynamicFields;
      }
      setFormState(immutableMerge(queryData.getTemplate, {
        dynamic_fields: {
          schema: dynamicFields.schema,
          uiSchema: dynamicFields.uiSchema
        }
      }))
    }
  }, [queryData]);

  const handleChange = (data) => {
    let newState = immutableMerge(formState, data.formData);
    if (!_.isEqual(newState, formState)) {
      setFormState(newState);
    }
  };

  const handleSubmit = () => {
    if (formRef.reportValidity()) {
      runMutation({
          variables: {
            input: immutableMerge(
              _.pick(formState, ['id', 'title', 'description', 'can_request', 'is_public', 'dynamic_fields']),
              {
                id: id == "new" ? null : id,
                dynamic_fields: JSON.stringify(formState.dynamic_fields),
                owner: {
                  connect: userProfile.id
                },
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
          history.push(`/template/content/${r.data.upsertTemplate.id}`);
        }
      });
    }
  };
  return (
    <LoadingContainer
      loading={[mutationLoading, queryLoading]}
      error={[mutationError, queryError]}
    >
      <ElentaJsonForm schema={schema}
                      uiSchema={uiSchema}
                      formData={formState}
                      onChange={handleChange}
                      ref={r => formRef = r}
      />
      {/*remove false and outer div when showing */}
      {false &&
       <div>
        <h3>Dynamic Fields</h3>
        <ElentaFormBuilder
          schema={formState.dynamic_fields.schema}
          uiSchema={formState.dynamic_fields.uiSchema}
          onSave={(schema: any, uiSchema: any) => {
            setFormState(immutableMerge(formState, {
              dynamic_fields: {
                schema: schema,
                uiSchema: uiSchema
              }
            }));
          }}
          excludedFields={['richtext', 'rank', 'slider', 'multiple-checkbox', 'radiobuttonlist', 'repeater']}
        />
       </div>
      }
      <Button onClick={handleSubmit}>Save Template</Button>
    </LoadingContainer>
  );
};

export default TemplateSettingsPage;
