import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";

export default function ProfileAvatar(props) {
	const {user, setIsLogged} = props;
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
				<Avatar src={user.profilePicture} alt="profile">
					{user.username ? user.username : `U`}
				</Avatar>
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
						handleClose();
						history.push(`/profile/${user._id}`);
					}}
				>
					Profile
				</MenuItem>
				<MenuItem
					onClick={() => {
						handleClose();
						setIsLogged(false);
						window.location = "/";
					}}
				>
					Logout
				</MenuItem>
			</Menu>
		</>
	);
}
