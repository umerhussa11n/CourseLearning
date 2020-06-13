import * as React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { useHistory } from "react-router-dom";

export const ProfileDropdownItem = ({profile, onClick}) => {
  const history = useHistory();
  return (
    <Dropdown.Item onClick={() => history.push('/preferences')}>
      Preferences
    </Dropdown.Item>
  );
};

export default ProfileDropdownItem;
