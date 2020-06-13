import * as React from 'react';
import './SubMenu.scss';

const SubMenuListItem = ({item, handleClick, parent}) => {
  
  return (<li
    className={"sxSubListItem"}
    onClick={() => handleClick(item, parent)}>
    <span className={"sxSubListItemLabel"}>{item.label}</span>
          </li>);
};

export default SubMenuListItem;