import * as React from 'react';
import { EditorState, convertToRaw, convertFromRaw, Modifier, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import ReactHtmlParser from 'react-html-parser';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './css/fields.css';
import SxSelect from "../../../shared/widgets/nestedselect/SxSelect";

//Widget
export class RichTextWidget extends  React.Component<any,any>{

  constructor(props) {
      super(props);
      this.state = {schema: props.schema};
  }

  render(){
      const { schema } = this.state;

      try{
          let jsonValue = JSON.parse(schema.textValue);
          return(
              <div>{ReactHtmlParser(jsonValue)}</div>
          );
        } catch(e) {
          //document.writeln("Caught: " + e.message)
          if(schema.textValue != "")
            console.log("Json Parse Errro in RichText", e);
        }
      return(
          <div>
              {schema.textValue !=="" && <div>{"JSON Parsing Error in RichText"}</div>}
          </div>
      );
  }
}

// Editor Field
export class TextField extends React.Component<any,any>{
  public static defaultProps = {
    getTagList: (): any[] => { return [{}];}
  };

  constructor(props) {
      super(props);
      const { formData } = props;
      try{
        const htmlValue = JSON.parse(formData.textValue);
        const blocksFromHtml = htmlToDraft(htmlValue);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        const editorState = EditorState.createWithContent(contentState);
        this.state = {...props, editorState};
      }
      catch(e){
        console.log("Error", e);
        this.state = {...props, editorState: EditorState.createEmpty()};
      }

  }
  componentDidUpdate(prevProps, prevState) {
    const { editorReferece } = this.state;
    /*if(editorReferece !== undefined){
      editorReferece.focus();
    }*/
  }
  componentDidMount(){

  }

  onEditorStateChange: Function = (editorState) => {
      this.setState({
        editorState,
      });
      //console.log("editor", editorState);
      const { formData } = this.state;
      const currentString = JSON.stringify(draftToHtml(convertToRaw(editorState.getCurrentContent())));
      if( formData.textValue !== currentString){
        formData.textValue = currentString;
        this.setState({formData});
      }
  };

  onSave = ()=>{
    this.props.onChange(this.state.formData);
  }

  setEditorReference = (ref) => {
    //this.editorReferece = ref;
    if(ref !== null){
      //this.setState({ editorReferece: ref })
      //ref.focus();
    }

  }

  render(){
      const { editorState } = this.state;
      return (
        <div className="rich-editor-root">
          <Editor
            editorRef={this.setEditorReference}
            editorState={editorState}
            wrapperClassName="rich-editor-wrapper"
            editorClassName="rich-editor-textarea"
            onEditorStateChange={this.onEditorStateChange}
            toolbarCustomButtons={[<TagOption tagList={this.props.getTagList()} />]}
          />
          <button className="rich-editor-btn-save btn btn-info" onClick={this.onSave}>
            Preview
          </button>
        </div>
      );
  }
}

interface TagOptionProps{
  tagList: [any];
  editorState: EditorState;
  onChange: (value: EditorState) => void;
}

class TagOption extends React.Component<any, any> {

  onSelectChange = (item)=>{
    const { editorState, onChange, tagList } = this.props;
    const arrFiltered = tagList.filter((listItem)=>{
      return listItem.id == item.parentId
    });
    let parentLabel = `${item.parentId}`
    if(arrFiltered.length > 0){
      parentLabel = arrFiltered[0].label;
    }
    const contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      `{{${parentLabel}:${item.label}}}`,
      editorState.getCurrentInlineStyle(),
    );
    onChange(EditorState.push(editorState, contentState, 'insert-characters'));
  }

  render() {
    return (
        <SxSelect
          placeholder="Form/Question" list={this.props.tagList}
          onSelectChange={this.onSelectChange}/>
    );
  }
}
