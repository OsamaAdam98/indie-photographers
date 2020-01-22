import React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import axios from "axios";
import FacebookIcon from "@material-ui/icons/Facebook";
import {Button, makeStyles} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	root: {
		"& > *": {
			margin: theme.spacing(1)
		}
	},
	extendedButton: {
		width: "100%"
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
				}
				if (user) {
					setUser(user);
				}
			})
			.catch((err) => {
				console.log(err);
				if (res.picture) {
					setUser({
						username: res.name,
						email: res.email,
						profilePicture: res.picture.data.url,
						admin: false
					});
					handleClose();
				}
			});
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
						color="primary"
						variant="contained"
						className={classes.extendedButton}
					>
						<FacebookIcon color="inherit" fontSize="default" />
						Facebook
					</Button>
				)}
			/>
		</>
	);
}
