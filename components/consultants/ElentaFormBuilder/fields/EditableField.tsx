import * as React from "react";
import {Droppable, Draggable} from "react-beautiful-dnd";
import {ButtonToolbar, Button} from "react-bootstrap";
import Form from 'react-jsonschema-form-bs4';
import debounce from 'lodash.debounce';
import Modal from 'react-modal';
import {reorder} from "../../../../utils/utils"
import {TextField, RichTextWidget} from "./TextField";
import EditorTitleField from "./EditorTitleField";
import EditorDescField from "./EditorDescField";
import DTPicker from "./DTPicker";
import {RankField} from "./RankField";
import {ImageWidget} from "./ImageWidget"
import {VideoWidget} from "./VideoWidget"
import RepeaterEditField from "./repeater/RepeaterEditField";
import CustomFieldTemplate from "./CustomFieldTemplate";
import SliderField from "./SliderField";
import LayoutField from '../../../shared/ElentaJsonForm/LayoutField';

Modal.setAppElement('#root')

export function pickKeys(source, target, excludedKeys) {
  const result = {};

  let isExcluded;
  for (let key in source) {
    isExcluded = excludedKeys.indexOf(key) !== -1;
    if (isExcluded) {
      continue;
    }
    result[key] = target[key];
  }
  return result;
}

export function shouldHandleDoubleClick(node) {
  // disable doubleclick on number input, so people can use inc/dec arrows
  if (node.tagName === "INPUT" &&
    node.getAttribute("type") === "number") {
    return false;
  }
  return true;
}

class FieldPropertiesEditor extends React.Component<any, any> {
  static answerModalStyle = {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }

  constructor(props) {
    super(props);
    const {uiType} = props.uiSchema;
    let {enableCorAnswer} = props.settings;
    if (!enableCorAnswer || !(uiType == "numberinput" || uiType == "slider" ||
      uiType == "text" || uiType == "multilinetext" ||
      uiType == "rank" || uiType == "multiple-checkbox" ||
      uiType == "radio" || uiType == "select" || uiType == "date")) {
      enableCorAnswer = false;
    }
    this.state = {editedSchema: props.schema, showSetCorAnswer: false, enableCorAnswer};
    this.onChangeDebounced = debounce(this.onChangeDebounced, 500);
  }

  getFormData = () => {
    const {schema, required} = this.props;
    const formData = {
      ...schema,
      required,
      ...this.state.editedSchema,
      name: this.state.name
    };
    return formData;
  }

  onUpdateTitleDesc = (formData) => {
    this.setState({editedSchema: formData});
    this.onChangeDebounced({formData});
  }

  onChange = ({formData}) => {
    this.setState({editedSchema: formData});
    this.onChangeDebounced({formData});
  }

  onChangeDebounced = ({formData}) => {
    this.props.onUpdate({formData})
  }

  /******* Begin - Correct Answer Modal Event ********/
  onShowSetCorAnswer = () => {
    this.setState({showSetCorAnswer: true});
  }

  onCloseSetCorAnswer = () => {
    this.setState({showSetCorAnswer: false});
  }

  onSetCorAnswer = ({formData}) => {
    this.setState({showSetCorAnswer: false});
    let {editedSchema} = this.state;
    editedSchema["correctAnswer"] = formData;
    this.setState({editedSchema});
    this.onChangeDebounced({formData: editedSchema});
  }

  //// End - Correct Answer Modal Event /////

  render() {

    const {schema, name, required, uiSchema, onUpdate, fields, widgets} = this.props;
    const {editedSchema, showSetCorAnswer, enableCorAnswer} = this.state;
    const formData = {
      ...schema,
      required,
      ...editedSchema,
      name: this.state.name
    };
    let corAnswerString = undefined;
    const corAnswerValue = editedSchema.correctAnswer;
    if (corAnswerValue !== undefined) {
      if (uiSchema.uiType != "date" && uiSchema.uiType != "multiple-checkbox" && uiSchema.uiType != "rank") {
        corAnswerString = `${corAnswerValue}`;
      } else {
        if (uiSchema.uiType == "multiple-checkbox" || uiSchema.uiType == "rank") {
          corAnswerString = corAnswerValue.map(i => '"' + i + '"').join(' ,');
        } else {
          corAnswerString = new Date(corAnswerValue).toLocaleString();
        }
      }
    }
    return (
      <div className="row panel panel-default field-editor">
        <div className="panel-body col-12">
          <EditorTitleField title={formData.title} updateTitle={this.onUpdateTitleDesc} getFormData={this.getFormData}/>
          <EditorDescField description={formData.description} updateDescription={this.onUpdateTitleDesc}
                           getFormData={this.getFormData}/>
          {enableCorAnswer === true && <React.Fragment>
            <button className="btn btn-primary form-group" onClick={this.onShowSetCorAnswer}>Set Correct Answer</button>
            {corAnswerString !== undefined && <p>Correct Answer: {corAnswerString}</p>}
          </React.Fragment>}
          <Form
            formData={formData}
            schema={uiSchema.editSchema}
            uiSchema={uiSchema.editUISchema}
            fields={{...fields}}
            onChange={this.onChange}>
            <button type="submit" hidden>Submit</button>
          </Form>
        </div>
        {showSetCorAnswer &&
        <Modal style={{content: FieldPropertiesEditor.answerModalStyle}}
               isOpen={true} shouldCloseOnOverlayClick={true}
               onRequestClose={this.onCloseSetCorAnswer}>
          <div className="answer-modal">
            <div className="row">
              <div className="col-12">
                <p>Set Correct Answer</p>
              </div>
              <div className="col-12 form-group">
                <Form
                  formData={corAnswerValue}
                  schema={editedSchema}
                  uiSchema={uiSchema}
                  fields={fields}
                  widgets={widgets}
                  onSubmit={this.onSetCorAnswer}>
                  <button type="submit" className="btn btn-success float-right btn-submit">Save</button>
                </Form>
              </div>
            </div>
          </div>
        </Modal>}
      </div>
    );
  }
}

//onSubmit={onUpdate}<button type="submit" className="btn btn-info float-right">Submit</button>

export default class EditableField extends React.Component<any, any> {
  public static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {schema: props.schema};
    this.handleChangeDebounced = debounce(this.handleChangeDebounced, 1000);
  }

  componentDidMount() {
    this.setState({mounted: true});
  }

  handleUpdate = ({formData}) => {
    // Exclude the "type" key when picking the keys as it is handled by the
    // SWITCH_FIELD action.
    const updated = pickKeys(this.props.schema, formData, ["type"]);
    const schema = {...this.props.schema, ...updated};
    this.setState({schema});
    this.props.updateField(
      this.props.name, schema, formData.required, formData.title);
  }

  handleDelete = (event) => {
    event.preventDefault();
    if (confirm("Are you sure you want to delete this field?")) {
      this.props.removeField(this.props.name);
    }
  }

  handleChange = ({formData}) => {
    const {uiType} = this.props.uiSchema;
    if (uiType !== "repeater" && uiType !== "rank") {
      let {mounted} = this.state;
      if (mounted == true && formData !== undefined) {
        this.handleChangeDebounced({formData});
      }
    }
  }

  handleChangeDebounced = ({formData}) => {
    let {schema} = this.state;
    schema.default = formData;
    this.handleUpdate({formData: schema});
  }


  render() {
    const props = this.props;
    const fields = {
      RichEditor: TextField,
      Rank: RankField,
      layout: LayoutField
    };
    const widgets = {
      RichText: RichTextWidget,
      RDP: DTPicker,
      Range: SliderField,
      Image: ImageWidget,
      Video: VideoWidget
    };
    const {uiSchema, registry} = props;
    const {schema} = this.state;
    const {uiType} = props.uiSchema;

    return (
      <div className="container-fluid">
        <Droppable droppableId={props.name}>

          {(droppableProvided) => (
            <div ref={droppableProvided.innerRef}>
              <Draggable draggableId={props.name} index={0}>
                {(draggableProvided, draggableSnapshot) => (
                  <div ref={draggableProvided.innerRef}
                       {...draggableProvided.draggableProps}
                       {...draggableProvided.dragHandleProps}>
                    <div className="editable-field">
                      <div className="row editfield-title">
                        <div className="col-sm-6 drag-container p-2">
                          <ButtonToolbar className="float-left">
                            <i className="fas fa-times-circle" onClick={this.handleDelete} style={{cursor: "pointer"}}/>
                          </ButtonToolbar>
                          <i className="fas fa-grip-vertical float-right"/>
                          {false && <strong>{uiSchema.label}</strong>}
                        </div>
                        <div className="col-sm-6 actions-container">
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
              <div className="row editfield-body">
                <div className="col-sm-6 editfield-preview pt-2">
                  <Form {...props}
                        schema={schema}
                        uiSchema={uiSchema}
                    //idSchema={{$id: props.name}}
                        fields={{...fields}}
                        widgets={{...widgets}}
                        onChange={this.handleChange}
                        FieldTemplate={CustomFieldTemplate}
                  >
                    <button type="submit" hidden>Submit</button>
                  </Form>
                </div>
                <div className="col-sm-6 editfield-settings">
                  {uiType === "repeater" && <RepeaterEditField {...props}
                                                               fields={{...fields}}
                                                               widgets={{...widgets}}
                                                               onUpdate={this.handleUpdate}/>
                  }
                  {uiType !== "repeater" && <FieldPropertiesEditor
                    {...props}
                    settings={registry.settings}
                    fields={{...fields}}
                    widgets={{...widgets}}
                    onUpdate={this.handleUpdate}/>
                  }
                </div>
              </div>
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    );
  }
}
