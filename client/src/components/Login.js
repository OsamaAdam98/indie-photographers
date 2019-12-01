import React, {useState} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import Modal from "react-bootstrap/Modal";

export default function Login(props) {
	const {isLogged, setIsLogged, setUser} = props;

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
					const {token} = res.data;
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
		<Link to="/profile" className="btn btn-outline-light">
			profile
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
