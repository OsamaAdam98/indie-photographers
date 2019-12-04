import React, {useState} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import FacebookLogin from "react-facebook-login";

export default function Login(props) {
	const {isLogged, setIsLogged, setUser, user} = props;

	const [show, setShow] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMsg, setErrorMsg] = useState("");

	const handleClose = () => {
		setShow(false);
		setErrorMsg("");
	};

	const handleShow = () => {
		setShow(true);
		setErrorMsg("");
	};

	const componentClicked = () => console.log("Button clicked");

	const responseFacebook = (res) => {
		axios
			.post("/api/auth/facebook-login", res)
			.then((res) => {
				const {token, user} = res.data;
				if (token) {
					localStorage.setItem("token", token);
					handleClose();
					setIsLogged(true);
				}
				if (user) {
					setUser(user);
				}
			})
			.catch((err) => {
				console.log(err);
				setUser({
					username: res.name,
					email: res.email,
					profilePicture: res.picture.data.url,
					admin: false
				});
				handleClose();
			});
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
						handleClose();
						setIsLogged(true);
					}
					if (user) {
						setUser(user);
					}
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
		<button
			type="button"
			className="btn btn-outline-light"
			onClick={handleShow}
		>
			Login
		</button>
	) : (
		<Link to="/profile">
			{user ? (
				<img
					src={user.profilePicture}
					alt="profile"
					style={{width: "2rem", height: "2rem", borderRadius: "50%"}}
				/>
			) : null}
		</Link>
	);

	const loginError = errorMsg ? (
		<div className="alert alert-danger" role="alert">
			{errorMsg}
		</div>
	) : null;
	return (
		<>
			{loginButton}
			<Modal show={show} onHide={handleClose}>
				<form onSubmit={handleSubmit}>
					<Modal.Header closeButton>
						<Modal.Title>Login</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="form-group">
							<label htmlFor="email-input">Email</label>
							<input
								type="email"
								className="form-control"
								id="email-input"
								value={email}
								onChange={emailChange}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="password-input">Password</label>
							<input
								type="password"
								className="form-control"
								id="password-input"
								value={password}
								onChange={passwordChange}
							/>
						</div>
						<FacebookLogin
							appId={`608523869954489`}
							autoLoad={false}
							textButton="Login using facebook"
							size="small"
							fields={`name,email,picture`}
							onClick={componentClicked}
							callback={responseFacebook}
							disableMobileRedirect={true}
						/>
						{loginError}
					</Modal.Body>
					<Modal.Footer>
						<button
							type="submit"
							className="btn btn-primary"
							onClick={handleSubmit}
						>
							Login
						</button>
						<button
							type="button"
							className="btn btn-dark"
							onClick={handleClose}
						>
							Close
						</button>
					</Modal.Footer>
				</form>
			</Modal>
		</>
	);
}
