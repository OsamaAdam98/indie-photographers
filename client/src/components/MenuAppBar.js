import React from "react";
import {withRouter, Link} from "react-router-dom";
import Login from "./modals/Login.modal";
import LeftDrawer from "./LeftDrawer";
import {
	makeStyles,
	AppBar,
	Toolbar,
	Typography,
	Avatar
} from "@material-ui/core";
import useWindowDimensions from "./utilities/WindowDimensions";

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
	const {isLogged, setIsLogged, user, setUser, showBtn, handleClick} = props;
	const {width} = useWindowDimensions();

	const classes = useStyles();

	return (
		<div className={(classes.root, classes.barMargin)}>
			<AppBar position="fixed" className={classes.appBar}>
				<Toolbar>
					{width > 500 && (
						<LeftDrawer
							user={user}
							showBtn={showBtn}
							handleClick={handleClick}
						/>
					)}
					<Link to="/">
						<Avatar
							alt="indie photographers"
							src={process.env.PUBLIC_URL + `/logo.png`}
							style={{
								marginRight: "1rem"
							}}
						/>
					</Link>
					<Typography variant="h6" className={classes.title}>
						Indie
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
