import * as React from "react";
import ListGroupItem from "react-bootstrap/ListGroupItem";

export const ProgramModuleCard = ({module, isActive, setActiveModule, children = null}) => {
  return (
    <ListGroupItem as="li"
                   data-id={module.id}
                   action active={isActive} onClick={() => setActiveModule(module)}>
      {module.title}
      {children}
    </ListGroupItem>
  )
};

export default ProgramModuleCard;
