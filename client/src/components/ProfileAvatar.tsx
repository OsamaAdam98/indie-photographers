import {IconButton, Menu, MenuItem} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import React, {useState} from "react";
import {useHistory} from "react-router-dom";

interface Props {
	setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileAvatar: React.FC<Props> = ({setIsLogged}) => {
	const history = useHistory();

	const [anchorEl, setAnchorEl] = useState<Element | null>(null);
	const open = Boolean(anchorEl);

	const handleMenu = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
				transitionDuration={{
					enter: 0,
					exit: 0
				}}
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
						setIsLogged(false);
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
