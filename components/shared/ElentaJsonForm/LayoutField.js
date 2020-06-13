// https://raw.githubusercontent.com/audibene-labs/react-jsonschema-form-layout/master/src/index.js

import React from 'react'
import ObjectField from 'react-jsonschema-form/lib/components/fields/ObjectField'
import {retrieveSchema} from 'react-jsonschema-form/lib/utils'
import {Col} from 'react-bootstrap'

export default class LayoutField extends ObjectField {
  constructor(props) {
    super(props);
    this.state = {firstName: 'hasldf'}
  }

  render() {
    const {
      uiSchema,
      errorSchema,
      idSchema,
      required,
      disabled,
      readonly,
      onBlur,
      formData
    } = this.props
    const {definitions, fields, formContext} = this.props.registry
    const {SchemaField, TitleField, DescriptionField} = fields
    const schema = retrieveSchema(this.props.schema, definitions)
    const title = (schema.title === undefined) ? '' : schema.title

    var layout = uiSchema['ui:layout'];
    // Default unspecified elements to full width
    if(schema.properties && Object.keys(schema.properties).length > 0) {
      if (uiSchema['ui:layout']) {
        layout = [
          ...uiSchema['ui:layout'],
          ...Object.keys(schema.properties).filter(
            k => !uiSchema['ui:layout'].map(
              l => Object.keys(l)
            ).flat().includes(k)
          ).map(k => {
            let o = {};
            o[k] = {md: 12};
            return o;
          })
        ]
      } else {
        // When layout not passed at all, just use schema
        layout = Object.keys(schema.properties).map(k => {
            let o = {};
            o[k] = {md: 12};
            return o;
          })
      }
    }

    return (
      <fieldset>
        {title ? <TitleField
          id={`${idSchema.$id}__title`}
          title={title}
          required={required}
          formContext={formContext}/> : null}
        {schema.description ?
          <DescriptionField
            id={`${idSchema.$id}__description`}
            description={schema.description}
            formContext={formContext}/> : null}
        {layout &&
        layout.map((row, index) => {
          return (
            <div className="row" key={index}>
              {
                Object.keys(row).map((name, index) => {
                  const {doShow, ...rowProps} = row[name]
                  let style = {}
                  if (doShow && !doShow({formData})) {
                    style = {display: 'none'}
                  }
                  if (schema.properties[name]) {
                    return (
                      <Col {...rowProps} key={index} style={style}>
                        <SchemaField
                          name={name}
                          required={this.isRequired(name)}
                          schema={schema.properties[name]}
                          uiSchema={uiSchema[name]}
                          errorSchema={errorSchema[name]}
                          idSchema={idSchema[name]}
                          formData={formData[name]}
                          onChange={this.onPropertyChange(name)}
                          onBlur={onBlur}
                          registry={this.props.registry}
                          disabled={disabled}
                          readonly={readonly}/>
                      </Col>
                    )
                  } else {
                    const {render, ...rowProps} = row[name]
                    let UIComponent = () => null

                    if (render) {
                      UIComponent = render
                    }

                    return (
                      <Col {...rowProps} key={index} style={style}>
                        <UIComponent
                          name={name}
                          formData={formData}
                          errorSchema={errorSchema}
                          uiSchema={uiSchema}
                          schema={schema}
                          registry={this.props.registry}
                        />
                      </Col>
                    )
                  }
                })
              }
              {this.props.removeButton &&
              <Col md={1} className="pt-4 mt-2">
                {this.props.removeButton}
              </Col>
              }
            </div>
          )
        })
        }
      </fieldset>
    )
  }
}
