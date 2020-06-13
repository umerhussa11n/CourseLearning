import * as React from "react";
import {RIEInput} from "riek";
import { any } from "prop-types";

interface Props {
  title: string;
  updateTitle: (any)=> void,
  getFormData: ()=> any
}

const EditorTitleField = (props: Props, state: any) => {

  const onUpdate = function(title) {    
    const formData = props.getFormData();
    const updatedData = {...formData, ...title };
    props.updateTitle( updatedData );
    //props.onChange({data:}); 
    //props.updateComponentTitle
  };
  const formData = props.getFormData();
  
  let {id, title=""} = formData;
  let bShowStatic: boolean = false;
  if(props.title == undefined || title == null){
    return(<React.Fragment></React.Fragment>);
  }
  //console.log("FormData", props);
  /*if(props.title != "Title"){
    bShowStatic = true;
  }*/  
  return (
    <React.Fragment>
      { bShowStatic && <h3 id={id}>{props.title}</h3>}
      { !bShowStatic &&
      <legend id={id}>
        <RIEInput
          className="edit-in-place"
          classEditing="edit-in-place-active"
          propName="title"
          value={title}
          change={onUpdate} />
      </legend>
      }
    </React.Fragment>    
  );
}

export default EditorTitleField;
