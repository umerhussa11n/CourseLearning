export default {
  projectName: process.env.PROJECT_NAME || "Elenta",
  server: {
    remote: process.env.SERVER_URL,
    bucket: "formbuilder",
  },
  appURL: process.env.APP_URL || window.location.origin + window.location.pathname,
  fieldList: [
    {
      id: "richtext",
      icon: "font",
      label: "Rich text",
      jsonSchema: {
        type: "string",
        textValue:"\"<p>Text</p>\""
      },
      uiSchema: {
        uiType: "richtext",
        "ui:options":{
          label:false
        },
        "ui:widget":"RichText",
        editSchema: {
          type: "object",
          properties: {
            textValue:{type: "string"}
          }
        },
        editUISchema:{
          "ui:field":"RichEditor"
        }
      },
      formData: {}
    },
    {
      id: "numberinput",
      icon: "sort-numeric-up",
      label: "Number Input",
      jsonSchema: {
        type: "number",
        title: "Edit me",
        description: "Enter some description",
        minimum: 0,
        maximum: 100,
        multipleOf: 2,
        default: 0
      },
      uiSchema: {
        uiType: "numberinput",
        editSchema: {
          type: "object",
          properties: {
            required: {type: "boolean", "title":"Required"},
            minimum:{ type: "number", title:"Minimum", default:0 },
            maximum:{ type: "number", title:"Maximum", default:100 },
            multipleOf:{ type: "number", title:"Step", default: 1 },
          }
        },
        editUISchema:{
          'ui:field': 'layout',
          'ui:layout': [
            {
              required: { md: 12}
            },
            {
              minimum: { md: 4 },
              maximum: { md: 4 },
              multipleOf: { md: 4}
            }
          ],
        },
      },
      formData: {}
    },
    {
      id: "slider",
      icon: "text-color",
      label: "Slider",
      jsonSchema: {
        type: "number",
        title: "Edit me",
        description: "Enter some description",
        min: 0,
        max: 100,
        step: 1,
      },
      uiSchema: {
        uiType: "slider",
        "ui:widget": "Range",
        editSchema: {
          type: "object",
          properties: {
            required: {type: "boolean", "title":"Required"},
            min:{ type: "number", title:"Minimum", default:0 },
            max:{ type: "number", title:"Maximum", default:100 },
            step:{ type: "number", title:"Step", default: 1 },
          }
        },
        editUISchema:{
          'ui:field': 'layout',
          'ui:layout': [
            {
              required: { md: 12}
            },
            {
              min: { md: 4 },
              max: { md: 4 },
              step: { md: 4}
            }
          ],
        },
      },
      formData: {}
    },
    {
      id: "text",
      icon: "text-color",
      label: "Short text",
      jsonSchema: {
        type: "string",
        title: "Edit me",
        description: "Enter some description",
        default: ""
      },
      uiSchema: {
        uiType: "text",
        editSchema: {
          type: "object",
          properties: {
            required: {type: "boolean", "title":"Required"},
          }
        },
        editUISchema:{}
      },
      formData: {}
    },
    {
      id: "multilinetext",
      icon: "align-left",
      label: "Long text",
      jsonSchema: {
        type: "string",
        title: "Edit me",
        description: "Enter some description",
        default: ""
      },
      uiSchema: {
        uiType: "multilinetext",
        "ui:widget": "textarea",
        editSchema: {
          type: "object",
          properties: {
            required: {type: "boolean", "title":"Required"},
          },
          editUISchema:{}
        },
      },
      formData: {}
    },
    {
      id: "rank",
      icon: "star",
      label: "Rank",
      jsonSchema: {
        type: "array",
        title: "A Rank Item list",
        description:"Enter some description",
        items: {
          type: "string",
          enum: ["Item 1", "Item 2", "Item 3"],
        }
      },
      uiSchema: {
        uiType: "rank",
        "ui:field": "Rank",
        editSchema: {
          type: "object",
          properties: {
            required: {type: "boolean", "title":"Required"},
            items: {
              type: "object",
              title: "Rank",
              properties: {
                enum: {
                  title: "",
                  type: "array",
                  items: {
                    type: "string",
                    default:"New Item"
                  },
                  default: ["Item 1", "Item 2", "Item3 3"],
                }
              }
            }
          }
        },
        editUISchema:{}
      },
      formData: {}
    },
    {
      id: "multiple-checkbox",
      icon: "check",
      label: "Multiple Choice",
      jsonSchema: {
        type: "array",
        title: "A multiple choices list",
        description:"Enter some description",
        items: {
          type: "string",
          enum: ["choice 1", "choice 2", "choice 3"],
        },
        uniqueItems: true,
      },
      uiSchema: {
        uiType: "multiple-checkbox",
        "ui:widget": "checkboxes",
        editSchema: {
          type: "object",
          properties: {
            required: {type: "boolean", "title":"Required"},
            items: {
              type: "object",
              title: "Choices",
              properties: {
                enum: {
                  title: "",
                  type: "array",
                  items: {
                    type: "string",
                    default:"New Item"
                  },
                  default: ["choice 1", "choice 2", "choice 3"],
                }
              }
            }
          }
        },
        editUISchema:{}
      },
      formData: {}
    },
    {
      id: "radiobuttonlist",
      icon: "list",
      label: "Radio Buttons",
      jsonSchema: {
        type: "string",
        description:"Enter some description",
        title: "Edit me",
        enum: ["option 1", "option 2", "option 3"],
      },
      uiSchema: {
        uiType: "radio",
        "ui:widget": "radio",
        editSchema: {
          type: "object",
          properties: {
            required: {type: "boolean", "title":"Required"},
            enum: {
              type: "array",
              title: "Options",
              items: {
                type: "string",
                default:"New Item"
              }
            }
          }
        },
        editUISchema:{}
      },
      formData: {}
    },
    {
      id: "select",
      icon: "chevron-down",
      label: "Dropdown",
      jsonSchema: {
        type: "string",
        format: "string",
        title: "Edit me",
        description:"Enter some description",
        enum: ["option 1", "option 2", "option 3"],
      },
      uiSchema: {
        uiType: "select",
        "ui:widget": "select",
        editSchema: {
          type: "object",
          properties: {
            required: {type: "boolean", "title":"Required"},
            enum: {
              type: "array",
              title: "Options",
              items: {
                type: "string",
                default:"New Item"
              }
            }
          }
        },
        editUISchema:{}
      },
      formData: {}
    },
    {
      id: "date",
      icon: "calendar",
      label: "Date",
      jsonSchema: {
        type: "integer",
        format: "date",
        dateFormat: true,
        timeFormat: false,
        title: "Edit me",
        description:"Enter some description"
      },
      uiSchema: {
        uiType: "date",
        "ui:widget": "RDP",
        editSchema: {
          type: "object",
          properties: {
            required: {type: "boolean", "title":"Required"},
            dateFormat: {type:"boolean","title":"Show Date"},
            timeFormat: {type:"boolean","title":"Show Time"},
          }
        },
        editUISchema:{
          'ui:field': 'layout',
          'ui:layout': [
            {
              required: { md: 12 }
            },
            {
              dateFormat: { md: 6 },
              timeFormat: { md: 6 },
            }
          ],
        }
      },
      formData: {}
    },
    {
      id: "image",
      icon: "font",
      label: "Image",
      jsonSchema: {
        type: "string",
        imageURL: "",
        title: "Edit me",
        description:"Enter some description"
      },
      uiSchema: {
        uiType: "image",
        "ui:widget":"Image",
        editSchema: {
          type: "object",
          properties: {
            imageURL:{type: "string", title:"Image URL"}
          }
        },
        editUISchema:{}
      },
      formData: {}
    },
    {
      id: "video",
      icon: "font",
      label: "Video",
      jsonSchema: {
        type: "string",
        videoURL: "",
        title: "Edit me",
        description:"Enter some description"
      },
      uiSchema: {
        uiType: "video",
        "ui:widget":"Video",
        editSchema: {
          type: "object",
          properties: {
            videoURL:{type: "string", title:"Video URL"}
          }
        },
        editUISchema:{}
      },
      formData: {}
    },
    {
      id: "repeater",
      icon: "check",
      label: "Repeater",
      jsonSchema: {
        "type":"array",
        title:"new",
        minItems: 1,
        maxItems: 3,
        description:"Enter some description",
         items:{
           type:"object",
           "properties":{},
          }
      },
      uiSchema: {
          uiType: "repeater",
          "items":{

          },
          editSchema: {
            "type":"object",
             "properties":{ }
          },
          editUISchema:{}
      },
      formData: {}
    },
  ],
};
