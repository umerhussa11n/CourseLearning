import * as React from "react";
import JsonForm from "react-jsonschema-form-bs4";
import DTPicker from "../../consultants/ElentaFormBuilder/fields/DTPicker";
import {ImageWidget} from "../../consultants/ElentaFormBuilder/fields/ImageWidget";
import {VideoWidget} from "../../consultants/ElentaFormBuilder/fields/VideoWidget";
import Tags from "../../tags/Tags";
import LayoutField from "./LayoutField";
import CompanyLogoField from "../../consultants/CompanyLogoField/CompanyLogoField";
import {RichTextWidget} from "../../consultants/ElentaFormBuilder/fields/TextField";

export const defaultFields = {
  tags: Tags,
  layout: LayoutField,
  companyLogoField: CompanyLogoField
};

const defaultWidgets = {
  RDP: DTPicker,
  Image: ImageWidget,
  Video: VideoWidget,
  RichText: RichTextWidget
};

interface Props {
  schema: any,
  uiSchema?: any,
  formData?: any,
  onChange?: any,
  children?: any,
  widgets?: any,
  fields?: any,
  disabled?: any,
}

interface State {
}

// TODO: pass option for button
class ElentaJsonForm extends React.Component<Props, State> {
  formRef: any;

  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }

  reportValidity() {
    return this.formRef.formElement.reportValidity();
  }

  render() {
    const {
      schema,
      uiSchema,
      formData,
      onChange,
      widgets,
      fields,
      disabled,
      ...rest
    } = this.props;
    return (
      <JsonForm schema={schema}
                uiSchema={{
                  "ui:field": "layout",
                  ...uiSchema
                }}
                formData={
                  formData ?
                    formData :
                    Object.keys(schema.properties).reduce((ac, a) => ({...ac, [a]: ''}), {})
                }
                onChange={onChange}
                widgets={{
                  widgets,
                  ...defaultWidgets
                }}
                fields={{
                  fields,
                  ...defaultFields
                }}
                disabled={disabled}
                ref={r => this.formRef = r}
                {...rest}

      >
        <br/>
      </JsonForm>
    );
  }
}

export default ElentaJsonForm;
