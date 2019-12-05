import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";

const drawerWidth = 240;

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
	toolbar: theme.mixins.toolbar
}));

export default function LeftDrawer() {
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

	const sideList = () => (
		<div
			className={classes.list}
			role="presentation"
			onClick={toggleDrawer(false)}
			onKeyDown={toggleDrawer(false)}
		>
			<div className={classes.toolbar} />
			<List>
				<ListItem button onClick={() => history.push("/")}>
					Home
				</ListItem>
				<Divider />
				<ListItem button onClick={() => history.push("/feed/")}>
					Feed
				</ListItem>
				<Divider />
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
