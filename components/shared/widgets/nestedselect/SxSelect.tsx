import * as React from 'react';
import onClickOutside from 'react-onclickoutside';
import SubMenu from './SubMenu/SubMenu';
import './SxSelect.scss'

// TODO: Replace with library
interface Props{
  placeholder: string,
  onSelectChange: (item: any) => void,
  list: any[]
}

class SxSelect extends React.Component<Props, any> {
  constructor(props) {
    super(props);
    this.state = {
      listOpen: false,
      placeholder: this.props.placeholder,
      showSubMenu: false,
      subMenuData: {parent: null, items: []},
      selectedItems: []
    };
  }

  handleClickOutside() {
    this.setState({
      listOpen: false,
      showSubMenu: false,
      subMenuData: {parent: null, items: []}
    })
  }

  selectItem = (item) => {
    if (!item.items || !item.items.length) {
      this.setState({
        placeholder: item.label,
        listOpen: false,
        selectedItems: [item]
      });
      this.handleChange(item);
    }
  };

  selectSubItem = (item, parent) => {
    this.setState({
      placeholder: `${parent.label}: ${item.label}`,
      selectedItems: [item, parent],
      listOpen: false
    });

    this.handleChange(item);
  };

  toggleList = () => {
    this.setState(prevState => ({
      listOpen: !prevState.listOpen
    }))
  };


  resetSelectedItems = () => {
    this.setState({selectedItems: [], placeholder: this.props.placeholder});
  }

  handleChange = (item) => {
    this.props.onSelectChange(item);
  }

  handleSubMenuMouseExit = () => {
    this.setState({showSubMenu: false})
  }

  handleMouseEnter = (item) => {
    this.setState({subMenuData: {parent: null, items: []}, showSubMenu: false});
    if (item.items && item.items.length) {
      this.setState({
        subMenuData: {parent: item, items: item.items},
        showSubMenu: true
      });
    }
  }

  handleMouseExit = () => {
    if (!this.state.showSubMenu) {
      this.setState({showSubMenu: false});
    }
  }

  render() {
    const {list} = this.props;
    const {listOpen, placeholder, selectedItems} = this.state;

    const isSubmenuOn = this.state.showSubMenu && listOpen;
    return (
      <div className={"sxSelectMain"}>
        <div className={"sxSelectWrapper"}>
          <div className={"sxSelectHeader"} onClick={this.toggleList}>
            <div className={"sxSelectPlaceholder"}>{placeholder}</div>
            <div className={"separatorWrapper"}>
              <span className={"indicatorSeparator"}/>
              <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false"
                   className={"chevron"}>
                <path
                  d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"/>
              </svg>
            </div>
          </div>
          <div className={"sxSelectListsWrapper"}>
            {listOpen && <ul className={"sxDropdownList"} >
              {list.map((item) => (

                <li
                  className={"sxListItem"}
                  key={item.id}
                  onMouseEnter={() => {
                    this.handleMouseEnter(item)
                  }}
                  onMouseLeave={this.handleMouseExit}

                  onClick={() => this.selectItem(item)}><span
                  className={"sxListItemLabel"}>{item.label}
                                                        </span>
                  {(item.items && item.items.length) ?
                    <svg className={"gt"} height="20" width="20" transform="rotate(-90)"
                         viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                      <path
                        d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"/>
                    </svg> : null}
                </li>
              ))}
                         </ul>}
            {isSubmenuOn &&
            <SubMenu data={this.state.subMenuData} x={this.state.subMenuX} y={this.state.subMenuY}
                     h={this.state.subMenuH} selectedItems={this.state.selectedItems}
                     handleMouseLeave={this.handleSubMenuMouseExit} handleClick={this.selectSubItem}
                     reset={this.resetSelectedItems}/>}
          </div>
        </div>
      </div>
    )
  }

}

export default onClickOutside(SxSelect);
