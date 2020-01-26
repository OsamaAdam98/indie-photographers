import React, {useEffect, useState} from "react";
import {withRouter, Link} from "react-router-dom";
import {
	makeStyles,
	AppBar,
	Toolbar,
	Typography,
	Avatar,
	useScrollTrigger,
	Slide
} from "@material-ui/core";
import logo from "../logo.png";
import {useWindowDimensions, LeftDrawer, Login, LightSwitch} from ".";

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
		marginBottom: "4rem"
	},
	toolbar: theme.mixins.toolbar
}));

function HideOnScroll(props) {
	const {children} = props;
	const trigger = useScrollTrigger();

	return (
		<Slide appear={false} direction="down" in={!trigger}>
			{children}
		</Slide>
	);
}

function MenuAppBar(props) {
	const {
		isLogged,
		setIsLogged,
		user,
		setUser,
		showBtn,
		handleClick,
		isLight,
		setIsLight
	} = props;
	const {width} = useWindowDimensions();

	const [show, setShow] = useState(false);

	const classes = useStyles();

	useEffect(() => {
		if (props.location.hash === "") setShow(false);
	}, [props.location.hash]);

	return (
		<div className={(classes.root, classes.barMargin)}>
			<HideOnScroll {...props}>
				<AppBar position="fixed" className={classes.appBar} color="inherit">
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
								src={logo}
								style={{
									marginRight: "1rem"
								}}
							/>
						</Link>
						<Typography variant="h5" className={classes.title}>
							Indie
						</Typography>
						{width > 500 && (
							<LightSwitch isLight={isLight} setIsLight={setIsLight} />
						)}
						<Login
							user={user}
							isLogged={isLogged}
							setIsLogged={setIsLogged}
							setUser={setUser}
							show={show}
							setShow={setShow}
							{...props}
						/>
					</Toolbar>
				</AppBar>
			</HideOnScroll>
		</div>
	);
}

export default withRouter(MenuAppBar);
