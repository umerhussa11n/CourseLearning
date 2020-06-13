import React from "react";

const ErrorListTemplate = (props) => {
  const {errors} = props;
  return (
    <ul className="errors-list">
      {errors.map(error => (
        <li key={error.stack}>
          {error.stack}
        </li>
      ))}
    </ul>
  );
};

export default ErrorListTemplate;