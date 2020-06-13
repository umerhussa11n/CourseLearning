import * as React from "react";
import {Dropdown}  from "react-bootstrap";
import config from "../../../config";

interface State{
  fieldList: [any];
  fieldListAction: string;
}

interface Props{
  className: string,
  name: string,
  variant: any,
  addField: (field: any) => void,
  switchField: (name:string, field: any) =>void,
  excludedFields: string[]
}

export default class FieldListDropdown extends React.Component<Props, State> {

  public static defaultProps = {
    variant: "success",
    excludedFields: []
  };

  constructor(props: any) {
    super(props);

    let fieldListAction = "add_field";
    if (this.props.name !== "") {
      fieldListAction = "switch_field";
    }
    this.state = {
      fieldList: config.fieldList.filter(f => !this.props.excludedFields.includes(f.id)),
      fieldListAction: fieldListAction
    };
  }

  handleFieldListAction = (fieldIndex) => {
    const fieldList = this.state.fieldList;
    fieldIndex = parseInt(fieldIndex, 10);
    if (typeof fieldList[fieldIndex] !== "undefined") {
      const field = fieldList[fieldIndex];
      if (this.state.fieldListAction === "switch_field") {
        this.props.switchField(this.props.name, field);
      } else {
        this.props.addField(field);
      }
    }
  }

  render () {
    return (
      <Dropdown drop="down" id="split-button-dropup" className={this.props.className}>
        <Dropdown.Toggle id="dropdown-toggle" variant={this.props.variant}>
          {this.props.children}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {this.state.fieldList.map((field, index) => {
            return <Dropdown.Item key={index}
                //eventKey={index}
                onSelect={() => this.handleFieldListAction(index)}
                className = "dropdown-item"
                ><i className={`${field.icon}`} />
                {field.label}
              </Dropdown.Item>;
          })}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}
