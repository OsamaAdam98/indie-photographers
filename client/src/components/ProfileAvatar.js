import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {Menu, MenuItem, IconButton} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";

export default function ProfileAvatar(props) {
	const {setIsLogged} = props;

	const history = useHistory();

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleMenu = (event) => {
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
				transitionDuration={0}
				transformOrigin={{
					vertical: "top",
					horizontal: "right"
				}}
				open={open}
				onClose={handleClose}
			>
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
						setIsLogged(false);
						window.location.reload();
					}}
				>
					Logout
				</MenuItem>
			</Menu>
		</>
	);
}
