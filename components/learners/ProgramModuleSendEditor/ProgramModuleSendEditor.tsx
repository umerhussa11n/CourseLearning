import * as React from "react";
import JsonForm from "react-jsonschema-form";
import {Module, ProgramModuleSend} from "../../../graphql/graphql-generated";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import "./ProgramModuleSendEditor.scss";
import Button from "react-bootstrap/Button";
import {formatDate, immutableMerge} from "../../../utils/utils";
import ElentaJsonForm from "../../shared/ElentaJsonForm/ElentaJsonForm";

export const ProgramModuleSendEditor: React.FunctionComponent<Props> = ({formData, module, onChange, onSubmit}) => {
  const handleChange = (key, val) => {
    let o = {};
    o[key] = val;
    onChange(o);
  };
  let formRef;

  return (
    <Container>
      {
        formData.response_timestamp &&
        <small>Responded on {formatDate(formData.response_timestamp)}</small>
      }
      <ElentaJsonForm disabled={!!formData.response_timestamp}
                      schema={immutableMerge(JSON.parse(module.content).schema, {
                        title: module.title,
                        description: module.description
                      })}
                      uiSchema={JSON.parse(module.content).uiSchema}
                      formData={formData.response_data}
                      onChange={d => handleChange('response_data', d.formData)}
                      ref={r => formRef = r}
      >
        <hr/>
      </ElentaJsonForm>
      <hr/>
      <Form>
        <Form.Group>
          <Form.Label className="pr-3">Was this useful?</Form.Label>
          <ToggleButtonGroup name='response_rating' value={formData.response_rating}
                             onChange={e => handleChange('response_rating', e)}>
            <ToggleButton className="btn-danger" value={0}>
              <i className="fas fa-thumbs-down"/>
            </ToggleButton>
            <ToggleButton className="btn-success" value={1}>
              <i className="fas fa-thumbs-up"/>
            </ToggleButton>
          </ToggleButtonGroup>
        </Form.Group>
        <Form.Group>
          <Form.Label>What would you do to improve this module?</Form.Label>
          <Form.Control as="textarea" rows={2} value={formData.response_feedback}
                        onChange={e => handleChange('response_feedback', (e.target as HTMLInputElement).value)}/>
        </Form.Group>
      </Form>
      <Button onClick={e => formRef.reportValidity() ? onSubmit() : null}>Submit</Button>
    </Container>

  );
};

interface Props {
  formData: ProgramModuleSend,
  module: Module,
  onChange: any,
  onSubmit: any
}

export default ProgramModuleSendEditor;
