import * as React from "react";
import {RIEInput} from "riek";
import { any } from "prop-types";

interface Props {
  description: string;
  updateDescription: (any)=> void,
  getFormData: ()=> any
}

const EditorDescField = (props: Props, state: any) => {

  const onUpdate = function(description) {        
    const formData = props.getFormData();
    const updatedData = {...formData, ...description };    
    props.updateDescription( updatedData );    
  };
  
  const formData = props.getFormData(); 
  let {id, description} = formData;
  
  if(props.description == undefined || description == null){
    return(<React.Fragment></React.Fragment>);
  }
  /*if(description == "" && props.description != undefined){
    description = "Enter some description";
  }*/
  
  return (
    <p id={id}>
      <RIEInput
        className="edit-in-place"
        classEditing="edit-in-place-active"
        propName="description"
        value={description}
        change={onUpdate} />
    </p>
  );
}


export default EditorDescField;
