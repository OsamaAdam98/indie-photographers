import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {Link} from "react-router-dom";
import Login from "./Login";
import Post from "./Post";

export default function NavBar(props) {
	const {isLogged, setIsLogged, user, setUser} = props;

	return (
		<>
			<Navbar
				bg="dark"
				variant="dark"
				sticky="top"
				collapseOnSelect
				expand="lg"
				className="mb-3"
			>
				<Navbar.Brand>
					<Link to="/" className="navbar-brand">
						Indie Filmmakers
					</Link>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="mr-auto">
						<Link to="/" className="nav-link">
							Home
						</Link>
						<Link to="/marketplace/" className="nav-link">
							Marketplace
						</Link>
					</Nav>
					<Post isLogged={isLogged} user={user} />
					<Login
						isLogged={isLogged}
						setIsLogged={setIsLogged}
						setUser={setUser}
					/>
				</Navbar.Collapse>
			</Navbar>
		</>
	);
}
