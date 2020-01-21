import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";
import {Link} from "react-router-dom";
import {Avatar} from "@material-ui/core";

const drawerWidth = 280;

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
	},
	avatarLarge: {
		width: theme.spacing(10),
		height: theme.spacing(10)
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
		<div>
			<img
				src="/accountBackground.png"
				alt="account-background"
				style={{
					objectFit: "cover",
					objectPosition: "50% 50%",
					height: "100px",
					width: "100%"
				}}
			/>
			<Link
				to={
					user.profilePicture
						? `/profile/${user._id}`
						: `${window.location.pathname}`
				}
			>
				<Avatar
					src={user.profilePicture ? user.profilePicture : ""}
					alt={user.username ? user.username : ""}
					className={classes.avatarLarge}
					style={{
						position: "absolute",
						top: "10px",
						left: "10px"
					}}
				/>
			</Link>
		</div>
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
