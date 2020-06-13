import * as React from "react";
import {RIEInput} from "riek";

interface Props{
  id: string;
  description: string;
  updateFormDescription: (formData: any) => void;
}

const DescriptionField = (props: Props) => {
  const onUpdate = function(formData) {    
    props.updateFormDescription(formData.description);
  };

  const {id, description=""} = props;  
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

DescriptionField.defaultProps = {
  updateFormDescription: (description: string)=>{}
}

export default DescriptionField;
