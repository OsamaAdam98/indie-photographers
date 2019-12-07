import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";
import Image from "material-ui-image";
import {Link} from "react-router-dom";

const drawerWidth = 200;

const useStyles = makeStyles((theme) => ({
	drawer: {
		width: drawerWidth,
		flexShrink: 0
	},
	menuButton: {
		marginRight: theme.spacing(2)
	},
	drawerPaper: {
		width: drawerWidth
	}
}));

export default function LeftDrawer(props) {
	const {user} = props;
	const history = useHistory();

	const classes = useStyles();

	const [state, setState] = useState(false);

	const toggleDrawer = (open) => (event) => {
		if (
			event &&
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}
		setState(open);
	};

	const userProfile = (
		<Link to={user.profilePicture ? `/profile` : `${window.location.pathname}`}>
			<Image
				src={
					user.profilePicture
						? user.profilePicture
						: "https://pngimage.net/wp-content/uploads/2018/05/default-user-profile-image-png-7.png"
				}
				aspectRatio={16 / 16}
				disableSpinner={true}
				disableTransition={true}
			/>
		</Link>
	);

	const sideList = () => (
		<div
			className={classes.list}
			role="presentation"
			onClick={toggleDrawer(false)}
			onKeyDown={toggleDrawer(false)}
		>
			{userProfile}
			<List>
				<ListItem button onClick={() => history.push("/")}>
					Home
				</ListItem>
				<ListItem button onClick={() => history.push("/feed/")}>
					Feed
				</ListItem>
				<ListItem button onClick={() => history.push("/marketplace/")}>
					Store
				</ListItem>
			</List>
		</div>
	);

	return (
		<>
			<IconButton
				edge="start"
				className={classes.menuButton}
				color="inherit"
				aria-label="menu"
				onClick={toggleDrawer(true)}
			>
				<MenuIcon />
			</IconButton>

			<SwipeableDrawer
				open={state}
				onClose={toggleDrawer(false)}
				onOpen={toggleDrawer(true)}
				className={classes.drawer}
				classes={{
					paper: classes.drawerPaper
				}}
			>
				{sideList()}
			</SwipeableDrawer>
		</>
	);
}
