import * as React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { pickKeys, shouldHandleDoubleClick } from "../EditableField";
import { ButtonToolbar, Button } from "react-bootstrap";
import SchemaField from "react-jsonschema-form-bs4/lib/components/fields/SchemaField";
import Form from "react-jsonschema-form-bs4";
import { getDefaultRegistry } from "react-jsonschema-form/lib/utils";
import debounce from 'lodash.debounce';
import EditorTitleField from "../EditorTitleField";
import EditorDescField from "../EditorDescField";
import {Dropdown}  from "react-bootstrap";
import config from "../../../../../config";
import {slugify, clone, reorder} from "../../../../../utils/utils"

export default class RepeaterEditField extends React.Component<any,any> {
    public static defaultProps = {

    };

  constructor(props) {
    super(props);
    const fieldList = config.fieldList.filter((element)=>{
        return (element.id == "numberinput"|| element.id == "slider"||
        element.id == "text"|| element.id == "multilinetext"||
        element.id == "rank"|| element.id == "multiple-checkbox"||
        element.id == "radiobuttonlist"|| element.id == "select"||
        element.id == "date")
    });

    this.state = {  schema: props.uiSchema.editSchema,
                    uiSchema: props.uiSchema,
                    editedSchema: props.schema,
                    fieldList,
                    newKey: 0,
                    currentIndex: 0
                };
    this.onChangeDebounced = debounce(this.onChangeDebounced, 500);
  }

  onUpdateTitleDesc = (formData) =>{
    this.setState({editedSchema: formData});
    this.onChangeDebounced({ formData });
  }

  getFormData = () =>{
    const {schema, required} = this.props;
    const formData = {
      ...schema,
      required,
      ...this.state.editedSchema,
      name: this.state.name
    };
    return formData;
  }

  onChange = (formData) => {
    const { editedSchema } = this.state;
    const properties = editedSchema.items.properties;
    editedSchema.items.properties = {...properties, ...formData};
    this.setState({ editedSchema });
    this.onChangeDebounced({ formData:editedSchema });
  }

  onChangeDebounced = ({formData}) =>{
    this.props.onUpdate({formData})
  }

  handleFieldListAction = (fieldIndex) => {
    const fieldList = this.state.fieldList;
    fieldIndex = parseInt(fieldIndex, 10);
    if (typeof fieldList[fieldIndex] !== "undefined") {
      const field = fieldList[fieldIndex];
      this.addField(field);
    }
  }

  addField = (field: any) : any =>{
    let { editedSchema, uiSchema, schema, currentIndex } = this.state;
    let schemaProperties = editedSchema.items.properties;
    let name, _slug;
    do{
        name = `Question ${currentIndex}`;
        _slug = slugify(name);
        currentIndex++;
        if(schemaProperties[_slug] == undefined)
            break;
    }while(true)

    schemaProperties[_slug] = {...field.jsonSchema, title: name};
    schema.properties[_slug] = field.uiSchema.editSchema;
    if(field.uiSchema["ui:widget"] != undefined)
        uiSchema.items[_slug] = { "ui:widget": field.uiSchema["ui:widget"] };
    if(field.uiSchema["ui:field"] != undefined)
        uiSchema.items[_slug] = { "ui:field": field.uiSchema["ui:field"] };
    uiSchema["ui:order"] = (uiSchema["ui:order"] || []).concat(_slug);
    let newKey = Math.random();
    editedSchema.items.properties = schemaProperties;
    this.setState({ editedSchema, schema, uiSchema, currentIndex, newKey });
    this.onChangeDebounced({ formData: editedSchema });
  }

  removeField = (name: string) => {
    let { editedSchema, schema, uiSchema } = this.state;
    //EditedSchema => schema value of props, uiSchema: uiSchema Value of props, schema => uiSchema.editSchema
    //const requiredFields = schema.required || [];
    delete schema.properties[name];
    delete uiSchema.items[name];
    uiSchema["ui:order"] = uiSchema["ui:order"].filter(
      (field) => field !== name);
    //schema.required = requiredFields
    //  .filter(requiredFieldName => name !== requiredFieldName);
    //if (schema.required.length === 0) {
    //  delete schema.required;
    //}
    delete editedSchema.items.properties[name];
    const newSchema = clone(schema);
    let newKey = Math.random();
    this.setState({ ...newSchema, uiSchema, editedSchema, newKey });
    this.onChangeDebounced({ formData: editedSchema });
  }

  swapFields = (source, target) => {
    const { uiSchema, editedSchema } = this.state;
    let order = uiSchema["ui:order"];
    const idxSource = order.indexOf(source);
    const idxTarget = order.indexOf(target);
    order = reorder(order,idxSource,idxTarget);    
    let newKey = Math.random();

    let schemaProperties = {};
    for(let i = 0; i < order.length; i++){
      const name = order[i];
      schemaProperties[name] = editedSchema.items.properties[name];
    }
    uiSchema["ui:order"] = order;
    editedSchema.items.properties = schemaProperties;
    this.setState({ uiSchema, newKey, editedSchema });
    this.onChangeDebounced({ formData: editedSchema });
  }

  onChangeMaxItem = (event) =>{
    let { editedSchema } = this.state;
    editedSchema.maxItems = Math.floor(event.target.value);
    this.setState({ editedSchema });
    this.onChangeDebounced({ formData: editedSchema });
  }

  handleDrop = (result) => {
    if (!result.destination) {
      return;
    }    
    const { source, destination } = result;
    this.swapFields(source.droppableId, destination.droppableId);
  }

  render() {
    const { required} = this.props;
    const { schema, uiSchema, newKey, editedSchema } = this.state;
    const formData = {
      ...schema,
      required,
      ...this.state.editedSchema,
      name: this.state.name
    };

    const registry = {
        ...getDefaultRegistry(),
        fields: {
          ...getDefaultRegistry().fields,
          SchemaField: SubEditableField,
          TitleField: () => {return <React.Fragment/>}
        },
        getFormData: this.getFormData,
        removeField: this.removeField,
        swapFields: this.swapFields
      };
    return (
        <div className="row panel panel-default field-editor">
            <div className="panel-heading clearfix col-12">
                <strong className="panel-title">Settings</strong>
            </div>
            <div className="panel-body col-12">
                <EditorTitleField title= {formData.title} updateTitle= { this.onUpdateTitleDesc } getFormData={ this.getFormData }/>
                <EditorDescField  description= {formData.description} updateDescription={ this.onUpdateTitleDesc } getFormData={ this.getFormData }/>
                <DragDropContext onDragEnd={this.handleDrop}>
                  <SchemaField
                              key = {newKey}
                              registry= { registry }
                              schema= { schema }
                              uiSchema= { uiSchema }
                              onChange= { this.onChange }
                            >
                  </SchemaField>
                </DragDropContext>                
                <div className="form-group field field-number">
                    <label >Max Items</label>
                    <input className="form-control" type="number" step="1" value={editedSchema.maxItems} onChange={this.onChangeMaxItem}></input>
                </div>

                <Dropdown drop="down" id="split-button-dropup" className="repeater-add-btn">
                    <Dropdown.Toggle id="dropdown-toggle" variant={"info"}>
                    Add a Subfield
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                    {this.state.fieldList.map((field, index) => {
                        return <Dropdown.Item key={index}
                            onSelect={() => this.handleFieldListAction(index)}
                            className = "dropdown-item"
                            ><i className={`${field.icon}`} />
                            {field.label}
                        </Dropdown.Item>;
                    })}
                    </Dropdown.Menu>
                </Dropdown>
                <Button variant="success" hidden>Submit</Button>
            </div>
        </div>

    );
  }
}

function DraggableFieldContainer(props) {
    const {
      children,
      dragData,
      onDelete
    } = props;
    return (
        <Droppable droppableId={dragData}>
          {(droppableProvided) => (
            <div ref={droppableProvided.innerRef}>
                <Draggable draggableId={dragData} index={0}>
                {(draggableProvided, draggableSnapshot) => (
                    <div
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                      className="row editable-field subfield-item"
                    >
                      <div className="col-sm-9">
                        {children}
                      </div>
                      <div className="col-sm-3 editable-field-actions">
                          <Button variant="danger" onClick={onDelete}>
                            <i className="fas fa-trash-alt"/>
                          </Button>
                      </div>
                    </div>
                )}                  
                </Draggable>                
                {droppableProvided.placeholder}
            </div>
            )}
        </Droppable>
    );
}

export class SubEditableField extends React.Component<any,any> {
    public static defaultProps = {

    };

    constructor(props) {
        super(props);
        const parentFormData = props.registry.getFormData();
        const jsonData =  parentFormData.items.properties[props.name];
        this.state = { editedSchema: jsonData, name: props.name};
    }

    handleDelete = (event) => {
        event.preventDefault();
        if (confirm("Are you sure you want to delete this field?")) {
            this.props.registry.removeField(this.props.name);
        }
    }

    getFormData = () =>{
        const { required } = this.props;
        const formData = {
            required,
            ...this.state.editedSchema
        };
        return formData;
    }

    onUpdateTitleDesc = (formData) =>{
        this.setState({editedSchema: formData});
        this.props.onChange(formData);
    }

    onChange = ({formData}) => {
        this.setState({editedSchema: formData});
        this.props.onChange(formData);
    }

    render() {
        const {schema, name, required} = this.props;
        const formData = {
            required,
            ...this.state.editedSchema,
        };

        return (
            <React.Fragment>
                <DraggableFieldContainer
                    draggableType="moved-subfield"
                    droppableTypes={["moved-subfield"]}
                    dragData={name}
                    onDelete={this.handleDelete}>                    
                    <EditorTitleField title ={formData.title} updateTitle= { this.onUpdateTitleDesc } getFormData={ this.getFormData }/>
                    <EditorDescField  description={formData.description} updateDescription={ this.onUpdateTitleDesc } getFormData={ this.getFormData }/>
                    <Form {...this.props}
                    formData={formData}
                    schema={schema}
                    onChange={this.onChange}>
                    <button type="submit" hidden>Submit</button>
                    </Form>
                </DraggableFieldContainer>
            </React.Fragment>

        );
    }
}
