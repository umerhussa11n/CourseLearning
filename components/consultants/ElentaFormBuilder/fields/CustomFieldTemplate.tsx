import * as React from "react";
export default function CustomFieldTemplate(props) {
    const {id, classNames, label, help, required, description, errors, children} = props;
    return (
      <div className={classNames}>
        <h5>{label}{required ? "*" : null}</h5>
        {description}
        {children}
        {errors}
        {help}
      </div>
    );
  }