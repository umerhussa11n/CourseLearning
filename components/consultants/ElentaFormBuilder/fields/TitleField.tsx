import * as React from "react";
import {RIEInput} from "riek";

interface Props{
  id: string;
  title: string
  updateFormTitle: (formData: any) => void;
}

const TitleField = (props: Props) => {

  const onUpdate = function(formData) {
    props.updateFormTitle(formData.title);
  };
  
  const {id, title=""} = props;
  return (
    <legend id={id}>
      <RIEInput
        className="edit-in-place"
        propName="title"
        value={title}
        change={onUpdate} />
    </legend>
  );
}

TitleField.defaultProps = {
  updateFormTitle: (title: string)=>{}
}

export default TitleField;
