import React, {useEffect, useState} from "react";
import {withRouter} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Login from "./modals/Login.modal";
import LeftDrawer from "./LeftDrawer";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		backgroundColor: "#212121",
		color: "#FAFAFA"
	},
	menuButton: {
		marginRight: theme.spacing(2)
	},
	title: {
		flexGrow: 1
	},
	barMargin: {
		marginBottom: "5rem"
	},
	toolbar: theme.mixins.toolbar
}));

function MenuAppBar(props) {
	const {isLogged, setIsLogged, user, setUser} = props;
	const {pathname} = props.location;

	const [position, setPosition] = useState("");

	useEffect(() => {
		switch (pathname) {
			case "/":
				setPosition("Home");
				break;
			case "/feed/":
				setPosition("Feed");
				break;
			case "/marketplace/":
				setPosition("Store");
				break;
			case "/profile":
				setPosition("Profile");
				break;
			default:
				setPosition("User Profile");
		}
	}, [pathname]);

	const classes = useStyles();

	return (
		<div className={(classes.root, classes.barMargin)}>
			<AppBar position="fixed" className={classes.appBar}>
				<Toolbar>
					<LeftDrawer user={user} />
					<Typography variant="h6" className={classes.title}>
						{position}
					</Typography>
					<Login
						user={user}
						isLogged={isLogged}
						setIsLogged={setIsLogged}
						setUser={setUser}
					/>
				</Toolbar>
			</AppBar>
		</div>
	);
}

export default withRouter(MenuAppBar);
