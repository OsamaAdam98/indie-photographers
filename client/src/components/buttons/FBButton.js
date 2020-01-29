import React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import axios from "axios";
import FacebookIcon from "@material-ui/icons/Facebook";
import {Button, makeStyles, Typography} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	root: {
		"& > *": {
			margin: theme.spacing(1)
		}
	},
	fbBtn: {
		backgroundColor: "#4267B2",
		width: "100%",
		height: 44,
		"&:hover": {
			backgroundColor: "#4F6FBF"
		},
		borderRadius: 2,
		justifyContent: "left"
	},
	fbIcon: {
		position: "absolute",
		left: 6,
		color: "#4F6FBF"
	},
	fbType: {
		fontSize: 14,
		postion: "relative",
		marginLeft: 30
	},
	btnDiv: {
		height: 42,
		width: 38,
		backgroundColor: "white",
		position: "absolute",
		left: 0,
		marginRight: 10,
		padding: 10,
		borderRadius: 2
	}
}));

export default function FBButton(props) {
	const {setUser, handleClose, setIsLogged} = props;
	const classes = useStyles();

	const componentClicked = () => console.log("Signing in using facebook.");

	const responseFacebook = (res) => {
		axios
			.post("/api/auth/facebook-login", res)
			.then((res) => {
				const {token, user} = res.data;
				if (token) {
					localStorage.setItem("token", token);
					setIsLogged(true);
					handleClose();

					setTimeout(() => {
						window.location.reload();
					}, 1000);
				}
				if (user) {
					setUser(user);
				}
			})
			.catch((err) => console.log(err));
	};

	return (
		<>
			<FacebookLogin
				appId={`608523869954489`}
				autoLoad={false}
				fields={`name,email,picture.width(800).height(800)`}
				onClick={componentClicked}
				callback={responseFacebook}
				disableMobileRedirect={true}
				render={(renderProps) => (
					<Button
						onClick={renderProps.onClick}
						variant="contained"
						color="inherit"
						className={classes.fbBtn}
					>
						<div className={classes.btnDiv} />
						<FacebookIcon
							color="inherit"
							fontSize="default"
							className={classes.fbIcon}
						/>
						<Typography variant="button" className={classes.fbType}>
							Facebook
						</Typography>
					</Button>
				)}
			/>
		</>
	);
}