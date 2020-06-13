import * as React from 'react';
import './SubMenu.scss';
import SubMenuListItem from './SubMenuListItem';

const SubMenu = (props) => {
  const {data, handleMouseLeave, handleClick} = props;
  return (<ul className={"sxSubDropdownList"} onMouseLeave={handleMouseLeave}>
    {
      data.items.map((item) => {        
        const {parent} = data;
        const itemProps = {item, handleClick, parent};
        return (<SubMenuListItem key={item.id} {...itemProps}/>)
    })
    }
          </ul>);

};

export default SubMenu;