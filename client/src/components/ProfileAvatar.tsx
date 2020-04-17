import { IconButton, Menu, MenuItem } from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { actions } from "../reducers/appReducer";

interface Props {
  dispatch: React.Dispatch<actions>;
}

const ProfileAvatar: React.FC<Props> = ({ dispatch }) => {
  const history = useHistory();

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <SettingsIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            history.push("/about");
            handleClose();
          }}
        >
          About
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            history.push("/settings");
          }}
        >
          Settings
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            dispatch({ type: "clearUser" });
            window.location.reload();
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProfileAvatar;
