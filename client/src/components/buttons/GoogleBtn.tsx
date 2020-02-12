import {makeStyles} from "@material-ui/core";
import axios from "axios";
import React from "react";
import {GoogleLogin} from "react-google-login";

const useStyles = makeStyles(() => ({
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

interface Props {
	setUser: React.Dispatch<React.SetStateAction<User>>;
	handleClose: () => void;
	setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
}

const GoogleBtn: React.FC<Props> = (props) => {
	const {setUser, handleClose, setIsLogged} = props;

	const classes = useStyles();

	const onResponse = (res: any) => {
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
			buttonText={"Google"}
			className={classes.gBtn}
			theme="dark"
		/>
	);
};

export default GoogleBtn;
