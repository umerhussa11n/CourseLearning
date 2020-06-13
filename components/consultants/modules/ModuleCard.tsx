import * as React from "react";
import {Button} from "react-bootstrap";
import ListGroupItem from "react-bootstrap/ListGroupItem";

export const ModuleCard = (props) => {
  const {
    item, onCollapse, onExpand, isActive,
    setActiveModule, duplicateModules, deleteModules, renameFolder = null
  } = props;

  return (
    <ListGroupItem as="li"
                   data-id={item.id}
                   action active={isActive} onClick={() => setActiveModule(item.data)}>
      <div className="d-flex justify-content-between">
        <div>
          <div>
           <span onClick={() => (item.data.isFolder && renameFolder) ? renameFolder(item) : () => null}>
           {item.data.name}
           </span>
          </div>
          {item.hasChildren &&
          <div>
            <span>
              {item.children.length} Modules
            </span>
          </div>
          }
        </div>

        <div className="actions d-flex flex-column align-items-end">
          <div className="mb-2">
            <Button variant="outline-dark" size="sm"
                    onClick={() => duplicateModules(item)}>
              <i className="fas fa-copy"/>
            </Button>
            {(!item.data.isReadOnly || item.data.isFolder) &&
            <Button variant="outline-dark" size="sm"
                    onClick={() => deleteModules(item)}>
              <i className="fas fa-trash"/>
            </Button>
            }
          </div>
          {item.hasChildren && (
            <span
              className="module-folder-expand mr-2"
              onClick={() => (item.isExpanded ? onCollapse() : onExpand())}>
              {item.isExpanded
                ? <i className="fas fa-minus"/>
                : <i className="fas fa-chevron-down"/>
              }
            </span>
          )}
        </div>
      </div>
    </ListGroupItem>
  );
};

export default ModuleCard;
