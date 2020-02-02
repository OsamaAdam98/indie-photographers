import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import axios from "axios";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Button,
	makeStyles,
	Grid
} from "@material-ui/core";
import {FBButton, ProfileAvatar, GoogleBtn} from "..";

const useStyles = makeStyles((theme) => ({
	root: {
		"& > *": {
			margin: theme.spacing(1)
		}
	},
	textField: {
		marginBottom: theme.spacing(1)
	}
}));

export default function Login(props) {
	const {isLogged, setIsLogged, setUser, user} = props;

	const classes = useStyles();
	const history = useHistory();

	const [show, setShow] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMsg, setErrorMsg] = useState("");

	const handleClose = () => {
		setShow(false);
		setErrorMsg("");
		if (props.location.hash === "#login-window") history.goBack();
	};

	const handleShow = () => {
		setShow(true);
		window.location.hash = "login-window";
		setErrorMsg("");
	};

	const emailChange = (event) => setEmail(event.target.value);
	const passwordChange = (event) => setPassword(event.target.value);
	const handleSubmit = (event) => {
		if (!email || !password) {
			setErrorMsg("Please enter all fields");
			event.preventDefault();
		} else {
			const user = {
				email,
				password
			};
			axios
				.post("/api/auth/", user)
				.then((res) => {
					const {token, user} = res.data;
					if (token) {
						localStorage.setItem("token", token);
						setEmail("");
						setPassword("");
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
				.catch((err) => {
					console.log(err);
					localStorage.removeItem("token");
					setIsLogged(false);
					setErrorMsg("Invalid credentials");
				});
		}
		event.preventDefault();
	};

	const loginButton = !isLogged ? (
		<Button color="inherit" onClick={handleShow}>
			Login
		</Button>
	) : (
		<ProfileAvatar user={user} setIsLogged={setIsLogged} />
	);

	return (
		<>
			{loginButton}
			<Dialog
				open={show}
				onClose={handleClose}
				transitionDuration={0}
				aria-labelledby="form-dialog-title"
			>
				<form onSubmit={handleSubmit} className={classes.root}>
					<DialogTitle id="form-dialog-title">Login</DialogTitle>

					<DialogContent>
						<TextField
							className={classes.textField}
							variant="outlined"
							id="name"
							label="Email Address"
							type="email"
							fullWidth
							value={email}
							onChange={emailChange}
						/>
						<TextField
							className={classes.textField}
							variant="outlined"
							id="password"
							label="Password"
							type="password"
							fullWidth
							value={password}
							onChange={passwordChange}
							error={errorMsg ? true : false}
							helperText={errorMsg}
						/>
						<Grid container direction="row" spacing={1}>
							<Grid item xs>
								<FBButton
									setUser={setUser}
									handleClose={handleClose}
									setIsLogged={setIsLogged}
								/>
							</Grid>
							<Grid item xs>
								<GoogleBtn
									setUser={setUser}
									handleClose={handleClose}
									setIsLogged={setIsLogged}
								/>
							</Grid>
						</Grid>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleSubmit} color="primary">
							Login
						</Button>
						<Button onClick={handleClose}>Cancel</Button>
					</DialogActions>
				</form>
			</Dialog>
		</>
	);
}
