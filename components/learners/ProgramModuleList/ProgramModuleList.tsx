import * as React from "react";
import ProgramModuleCard from "./ProgramModuleCard";
import ListGroup from "react-bootstrap/ListGroup";
import {Module} from "../../../graphql/graphql-generated";

export const ProgramModuleList: React.FunctionComponent<Props> = ({modules, activeModule, setActiveModule}) => {
  return (
    <ListGroup>
      {
        modules.map(m => {
          return <ProgramModuleCard
            key={m.id}
            module={m}
            isActive={m.id === activeModule.id}
            setActiveModule={setActiveModule}
          />
        })
      }
    </ListGroup>
  );
};

interface Props {
  modules: Module[]
  activeModule: Module,
  setActiveModule: any
}
export default ProgramModuleList;
