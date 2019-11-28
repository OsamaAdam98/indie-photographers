import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import Modal from "react-bootstrap/Modal";

export default function Login() {
	const [show, setShow] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLogged, setIsLogged] = useState(false);

	const handleClose = () => setShow(false);

	const handleShow = () => setShow(true);

	useEffect(() => {
		if (localStorage.getItem("token")) setIsLogged(true);
	}, []);

	const emailChange = (event) => setEmail(event.target.value);
	const passwordChange = (event) => setPassword(event.target.value);
	const handleSubmit = (event) => {
		if (!email || !password) {
			console.log("no email or password");
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
						console.log(token);
						setEmail("");
						setPassword("");
						handleClose();
						setIsLogged(true);
					}
				})
				.catch((err) => {
					console.log(err);
					localStorage.removeItem("token");
					setIsLogged(false);
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
