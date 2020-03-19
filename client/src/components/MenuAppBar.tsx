import {
	AppBar,
	Avatar,
	makeStyles,
	Slide,
	Toolbar,
	Typography,
	useScrollTrigger
} from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { BottomBar, LightSwitch, Login, useWindowDimensions } from ".";
import logo from "../assets/logo.png";

const useStyles: any = makeStyles((theme: any) => ({
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		position: "relative",
		boxShadow: "0px 0px 0px 0px"
	},
	menuButton: {
		marginRight: "1rem"
	},
	title: {
		flexGrow: 1
	},
	toolbar: theme.mixins.toolbar,
	bottomBar: {
		position: "sticky",
		top: 0,
		zIndex: theme.zIndex.appBar,
		marginBottom: "1rem"
	},
	"@media (max-width: 31.25rem)": {
		bottomBar: {
			position: "fixed",
			top: "auto",
			bottom: 0,
			zIndex: theme.zIndex.appBar,
			width: "100vw",
			marginBottom: 0
		},
		appBar: {
			zIndex: theme.zIndex.drawer + 1,
			position: "sticky",
			boxShadow: "0px 1px 5px 1px rgba(0, 0, 0, .3)",
			marginBottom: theme.spacing(2)
		}
	}
}));

const HideOnScroll: React.FC = ({ children }) => {
	const trigger = useScrollTrigger();

	return (
		<Slide appear={false} direction="down" in={!trigger}>
			{children}
		</Slide>
	);
};

const MenuAppBar: React.FC = (props) => {
	const { width } = useWindowDimensions();
	const classes = useStyles();

	return (
		<>
			<HideOnScroll {...props}>
				<AppBar className={classes.appBar} color="inherit">
					<Toolbar className={classes.toolbar}>
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
						{width > 500 && <LightSwitch />}
						<Login />
					</Toolbar>
				</AppBar>
			</HideOnScroll>
			<div className={classes.bottomBar}>
				<BottomBar />
			</div>
		</>
	);
};

export default React.memo(MenuAppBar);
