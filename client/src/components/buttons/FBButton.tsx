import {Button, makeStyles, Typography} from "@material-ui/core";
import FacebookIcon from "@material-ui/icons/Facebook";
import axios from "axios";
import React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import {actions} from "../../reducers/appReducer";

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

interface Props {
	handleClose: () => void;
	dispatch: React.Dispatch<actions>;
}

const FBButton: React.FC<Props> = ({dispatch, handleClose}) => {
	const classes = useStyles();

	const componentClicked = () => console.log("Signing in using facebook.");

	const responseFacebook = (res: any) => {
		axios
			.post(`/api/auth/facebook-login`, res)
			.then((res) => {
				const {token, user} = res.data;
				if (token) {
					localStorage.setItem("token", token);
				}
				if (user) {
					dispatch({type: "setUser", user});
					setTimeout(() => {
						window.location.reload();
					}, 1000);
				}
			})
			.catch((err) => {
				dispatch({type: "showSnackAlert", errorMsg: "Login failed!", severity: "error"});
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
				render={(renderProps: any) => (
					<Button onClick={renderProps.onClick} variant="contained" color="inherit" className={classes.fbBtn}>
						<div className={classes.btnDiv} />
						<FacebookIcon color="inherit" fontSize="default" className={classes.fbIcon} />
						<Typography variant="button" className={classes.fbType}>
							Facebook
						</Typography>
					</Button>
				)}
			/>
		</>
	);
};

export default FBButton;
