import Button from "react-bootstrap/Button";
import * as React from "react";
import LayoutField from "./LayoutField";
import TitleField from "@rjsf/core/lib/components/fields/TitleField";
import DescriptionField from "@rjsf/core/lib/components/fields/DescriptionField";
import {retrieveSchema} from "react-jsonschema-form/lib/utils";

const ArrayLayoutField = (uiSchema) => {
  return (props) => {

    const {definitions, fields, formContext} = props.registry
    const {SchemaField, TitleField, DescriptionField} = fields
    const schema = retrieveSchema(props.schema, definitions)
    const title = (schema.title === undefined) ? '' : schema.title

    return (
      <div>
        {title ? <TitleField
          id={`${props.idSchema.$id}__title`}
          title={title}
          required={props.required}
          formContext={formContext}/> : null}
        {schema.description ?
          <DescriptionField
            id={`${props.idSchema.$id}__description`}
            description={schema.description}
            formContext={formContext}/> : null}
        {props.items &&
        props.items.map(element => (
          <div key={element.index}>
            <div>
              <LayoutField
                {...element.children.props}
                uiSchema={uiSchema}
                removeButton={props.items.length > props.schema.minItems &&
                  <Button className="btn-danger" onClick={element.onDropIndexClick(element.index)}>
                    <i className="fas fa-minus"/>
                  </Button>
                }

              />
            </div>
          </div>
        ))}
        {props.canAdd &&
        <Button onClick={props.onAddClick} className="mr-4 float-right">
          <i className="fas fa-plus"/>
        </Button>
        }
      </div>
    )
  };
};

export default ArrayLayoutField;
