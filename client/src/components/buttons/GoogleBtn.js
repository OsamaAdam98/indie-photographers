import React from "react";
import axios from "axios";
import {GoogleLogin} from "react-google-login";
import {makeStyles, Typography} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	gBtn: {
		width: "100%"
	},
	gIcon: {
		marginRight: 3
	},
	gType: {
		padding: 0
	}
}));

export default function GoogleBtn(props) {
	const {setUser, handleClose, setIsLogged} = props;

	const classes = useStyles();

	const onResponse = (res) => {
		axios
			.post("/api/auth/google-login", res)
			.then((res) => {
				const {token, user} = res.data;
				if (token) {
					localStorage.setItem("token", token);
					setIsLogged(true);
				}
				if (user) {
					setUser(user);
				}
				handleClose();

				setTimeout(() => {
					window.location.reload();
				}, 1000);
			})
			.catch((err) => console.log(err));
	};

	return (
		<GoogleLogin
			clientId="534118121647-dmkt2evfqn84d2s48f3phnpjfociapnk.apps.googleusercontent.com"
			onSuccess={onResponse}
			onFailure={onResponse}
			cookiePolicy={"single_host_origin"}
			buttonText={
				<Typography variant="button" className={classes.gType}>
					Google
				</Typography>
			}
			className={classes.gBtn}
			icon={true}
			theme="dark"
		/>
	);
}