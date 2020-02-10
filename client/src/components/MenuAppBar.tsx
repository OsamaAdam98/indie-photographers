import React from "react";
import {withRouter, Link, RouteComponentProps} from "react-router-dom";
import {
	AppBar,
	Toolbar,
	Typography,
	Avatar,
	useScrollTrigger,
	Slide,
	makeStyles
} from "@material-ui/core";
import logo from "../assets/logo.png";
import {useWindowDimensions, Login, LightSwitch, BottomBar} from ".";

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

const HideOnScroll: React.FC = (props) => {
	const {children} = props;
	const trigger = useScrollTrigger();

	return (
		<Slide appear={false} direction="down" in={!trigger}>
			{children}
		</Slide>
	);
};

interface Props extends RouteComponentProps<MatchParams> {
	isLogged: boolean;
	setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
	user: User;
	setUser: React.Dispatch<React.SetStateAction<User>>;
	isLight: boolean;
	setIsLight: React.Dispatch<React.SetStateAction<boolean>>;
}

const MenuAppBar: React.FC<Props> = (props) => {
	const {isLogged, setIsLogged, user, setUser, isLight, setIsLight} = props;
	const {width} = useWindowDimensions();
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
						{width > 500 && (
							<LightSwitch isLight={isLight} setIsLight={setIsLight} />
						)}
						<Login
							isLogged={isLogged}
							setIsLogged={setIsLogged}
							setUser={setUser}
							{...props}
						/>
					</Toolbar>
				</AppBar>
			</HideOnScroll>
			<div className={classes.bottomBar}>
				<BottomBar user={user} />
			</div>
		</>
	);
};

export default withRouter(MenuAppBar);
