import * as React from "react";
import {DragDropContext} from "react-beautiful-dnd";
import SchemaField from "react-jsonschema-form-bs4/lib/components/fields/SchemaField";
import {getDefaultRegistry} from "react-jsonschema-form/lib/utils";
import {slugify, clone, unique} from "../../../utils/utils"
import FormActions from "./FormActions";
import EditableField from "./fields/EditableField";
import TitleField from "./fields/TitleField";
import DescriptionField from "./fields/DescriptionField";
import {TextField} from "./fields/TextField";
import _ from "lodash";

import "react-datetime/css/react-datetime.css";
import Alert from "react-bootstrap/Alert";


interface State {
  error: string;
  schema: any;
  uiSchema: any;
  formData: any;
  currentIndex: number;
  newKey: number;
  enableCorAnswer: boolean;
}

interface Props {
  schema: any;
  uiSchema: any;
  onSave: (schema: any, uiSchema: any) => void;
  excludedFields?: string[];
  tagList?: any;
  enableCorAnswer?: boolean;
}

export default class ElentaFormBuilder extends React.Component<Props, State> {

  public static defaultProps = {
    enableCorAnswer: false
  };

  constructor(props: Props) {
    super(props);
    const {schema, uiSchema} = props;
    this.state = {
      error: null,
      schema,
      uiSchema,
      formData: {},
      currentIndex: 0,
      newKey: 0,
      enableCorAnswer: props.enableCorAnswer
    };
    DescriptionField.defaultProps = {updateFormDescription: this.updateFormDescription};
    TitleField.defaultProps = {updateFormTitle: this.updateFormTitle};
    EditableField.defaultProps = {
      addField: this.addField, switchField: this.swapFields,
      removeField: this.removeField, updateField: this.updateField,
      renameField: this.renameField, insertField: this.insertField,
      swapFields: this.swapFields
    };
    TextField.defaultProps = {getTagList: this.getTagList};

  }

  componentDidMount() {

    //Object.assign(
    //{}, DescriptionField.defaultProps || {}, {updateFormDescription: this.updateFormDescription});
  }

  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual(this.state, prevState)) {
      this.saveSchema();
    }
    if (!_.isEqual(this.props, prevProps)) {
      this.setState({
        schema: this.props.schema,
        uiSchema: this.props.uiSchema
      })
    }
  }

  onChange = (e) => {
    //console.log("FormData" , e);
  }

  onSubmit = (e) => {
    //console.log("FormData", e);
  }

  //*********  Actions  ***********/

  updateFormDescription = (description: string) => {
    this.setState({schema: {...this.state.schema, description}})
  }

  updateFormTitle = (title: string) => {
    this.setState({schema: {...this.state.schema, title}})
  }


  addField = (field: any): any => {

    let {currentIndex, schema, uiSchema} = this.state;
    let name, _slug;
    console.log(schema);
    console.log(uiSchema);
    let schemaProperties = schema.properties;
    do{
        name = `Question ${currentIndex}`;
        _slug = slugify(name);
        currentIndex++;
        if(schemaProperties === undefined || schemaProperties[_slug] == undefined)
            break;
    }while(true)
    const jsonSchema = clone(field.jsonSchema);
    const {title} = jsonSchema;
    if (title != undefined)
      schema.properties[_slug] = {...jsonSchema, title: name};
    else
      schema.properties[_slug] = {...jsonSchema};
    uiSchema[_slug] = clone(field.uiSchema);
    uiSchema[_slug].label = field.label;
    uiSchema["ui:order"] = (uiSchema["ui:order"] || []).concat(_slug);
    let newKey = Math.random();
    return this.setState({schema, uiSchema, currentIndex, newKey});
  }

  switchField = (propertyName: string, newField: any) => {
    const {schema, uiSchema} = this.state;
    schema.properties[propertyName] = {...newField.jsonSchema};
    uiSchema[propertyName] = newField.uiSchema;
    this.setState({schema, uiSchema});
  }

  removeField = (name: string) => {
    const {schema, uiSchema} = this.state;

    const requiredFields = schema.required || [];
    delete schema.properties[name];
    delete uiSchema[name];
    uiSchema["ui:order"] = uiSchema["ui:order"].filter(
      (field) => field !== name);
    schema.required = requiredFields
      .filter(requiredFieldName => name !== requiredFieldName);
    if (schema.required.length === 0) {
      delete schema.required;
    }
    const newSchema = clone(schema);
    let newKey = Math.random();
    return this.setState({...newSchema, uiSchema, error: null, newKey});
  }

  updateField = (name: string, newSchema: any, required: boolean, newLabel: string) => {
    const {schema} = this.state;
    const existing = Object.keys(schema.properties);
    const newName = slugify(newLabel);

    if (name !== newName && existing.indexOf(newName) !== -1) {
      // Field name already exists, we can't update state
      const error = `Duplicate field name "${newName}", operation aborted.`;
      return this.setState({error});
    }
    const requiredFields = schema.required || [];
    schema.properties[name] = newSchema;
    if (required) {
      // Ensure uniquely required field names
      schema.required = unique(requiredFields.concat(name));
    } else {
      schema.required = requiredFields
        .filter(requiredFieldName => name !== requiredFieldName);
    }
    if (newName !== name) {
      return this.renameField(name, newName);
    }
    let newKey = Math.random();
    return this.setState({schema, error: null, newKey});
  }

  renameField = (name: string, newName: string) => {
    const {schema, uiSchema} = this.state;
    const newSchema = clone(schema.properties[name]);
    const newUiSchema = clone(uiSchema[name]);
    const order = uiSchema["ui:order"];
    const required = schema.required;
    delete schema.properties[name];
    delete uiSchema[name];
    schema.properties[newName] = newSchema;
    schema.required = required.map(fieldName => {
      return fieldName === name ? newName : fieldName;
    });
    uiSchema[newName] = newUiSchema;
    uiSchema["ui:order"] = order.map(fieldName => {
      return fieldName === name ? newName : fieldName;
    });
    let newKey = Math.random();
    this.setState({schema, uiSchema, error: null, newKey});
  }

  insertField = (field: any, before: any) => {
    const insertedState = this.addField(field);
    const order = insertedState.uiSchema["ui:order"];
    const added = order[order.length - 1];
    const idxBefore = order.indexOf(before);
    const newOrder = [].concat(
      order.slice(0, idxBefore),
      added,
      order.slice(idxBefore, order.length - 1)
    );
    insertedState.uiSchema["ui:order"] = newOrder;
    this.setState({...insertedState, error: null});
  }

  swapFields = (source, target) => {
    const {uiSchema} = this.state;
    const order = uiSchema["ui:order"];
    const idxSource = order.indexOf(source);
    const idxTarget = order.indexOf(target);
    order[idxSource] = target;
    order[idxTarget] = source;
    let newKey = Math.random();
    this.setState({uiSchema, error: null, newKey});
  }

  getTagList = (): any[] => {
    const {tagList} = this.props;
    return tagList == undefined ? [] : tagList;
  }

  saveSchema = () => {
    const {schema, uiSchema} = this.state;
    this.props.onSave(schema, uiSchema);
  }

  handleDrop = (result) => {
    if (!result.destination) {
      return;
    }
    const {source, destination} = result;
    this.swapFields(source.droppableId, destination.droppableId);
  }

  //********  Render *******/
  render() {
    const {enableCorAnswer, error, schema, newKey, uiSchema} = this.state;
    const registry = {
      ...getDefaultRegistry(),
      settings: {
        enableCorAnswer
      },
      fields: {
        ...getDefaultRegistry().fields,
        SchemaField: EditableField,
        TitleField: TitleField,
        DescriptionField: DescriptionField,
      },
      //widgets:{...widgets,...getDefaultRegistry().widgets}
    };
    return (
      <div className="container-fluid">
        {error ? <div className="alert alert-danger">{error}</div> : <div/>}

        <div className="rjsf builder-form">
          {Object.keys(schema.properties).length > 0 &&
          <DragDropContext onDragEnd={this.handleDrop}>
            <div className="row">
              <h5 className="col-md-6 text-center">Preview</h5>
              <h5 className="col-md-6 text-center">Settings</h5>
            </div>
            <SchemaField key={newKey} {...this.state}
                         schema={schema}
                         registry={registry}
                         onChange={this.onChange}/>
          </DragDropContext>
          }
          {Object.keys(schema.properties).length == 0 &&
            <Alert variant="info">
              Get started by adding a field below
            </Alert>
          }
        </div>
        <FormActions
          schema={schema}
          uiSchema={uiSchema}
          addField={this.addField}
          switchField={this.switchField}
          saveSchema={this.saveSchema}
          excludedFields={this.props.excludedFields}
        />
      </div>
    );
  }
}

/*const fields = {
      RichEditor: TextField,
      Rank: RankField,
    };
    const widgets = {
      RichText: RichTextWidget,
      RDP: DTPicker,
      Range: Slider,
      Image: ImageWidget,
      Video: VideoWidget
    };*/
/*{false && <h1>Preview</h1>}
    {false && <JsonForm key={newKey+1} {...this.state}
                schema ={schema} uiSchema = {uiSchema}
                fields={{...fields}}
                widgets={{...widgets}} onChange={this.onChange}
                onSubmit={this.onSubmit}>
      <button type="submit" className="">Submit</button>
      </JsonForm>}
*/
