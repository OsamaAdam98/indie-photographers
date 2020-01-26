import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";
import {Link} from "react-router-dom";
import {
	Avatar,
	List,
	ListItem,
	SwipeableDrawer,
	makeStyles,
	IconButton
} from "@material-ui/core";

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
	const {user, showBtn, handleClick} = props;
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

	const UserProfile = () => (
		<div>
			<div
				style={{
					height: "100px",
					width: "100%",
					backgroundColor: "#212121"
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

	const SideList = () => (
		<div
			className={classes.list}
			role="presentation"
			onClick={toggleDrawer(false)}
			onKeyDown={toggleDrawer(false)}
		>
			<UserProfile />
			<ListItem
				button
				onClick={handleClick}
				style={{
					display: showBtn ? "" : "none"
				}}
			>
				<div
					style={{
						width: "100%",
						height: "3rem",
						textAlign: "center",
						verticalAlign: "center",
						lineHeight: "3rem"
					}}
				>
					INSTALL APP
				</div>
			</ListItem>
			<List>
				<ListItem button onClick={() => history.push("/")}>
					Home
				</ListItem>
				<ListItem button onClick={() => history.push("/feed/")}>
					Feed
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
				<SideList />
			</SwipeableDrawer>
		</>
	);
}
