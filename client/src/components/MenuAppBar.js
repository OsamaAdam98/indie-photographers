import React from "react";
import {withRouter} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Login from "./modals/Login.modal";
import LeftDrawer from "./LeftDrawer";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1
	},
	menuButton: {
		marginRight: theme.spacing(2)
	},
	title: {
		flexGrow: 1
	},
	barMargin: {
		marginBottom: "1rem"
	},
	toolbar: theme.mixins.toolbar
}));

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

function MenuAppBar(props) {
	const {isLogged, setIsLogged, user, setUser} = props;

	const classes = useStyles();

	return (
		<div className={(classes.root, classes.barMargin)}>
			<AppBar position="sticky" className={classes.appBar} color="primary">
				<Toolbar>
					<LeftDrawer />
					<Typography variant="h6" className={classes.title}>
						{props.location.pathname !== "/"
							? props.location.pathname.replace(/\\|\//g, "").capitalize()
							: "Home"}
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
