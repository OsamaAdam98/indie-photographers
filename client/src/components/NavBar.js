import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {Link} from "react-router-dom";
import Login from "./Login";

export default function NavBar() {
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
					<Login />
				</Navbar.Collapse>
			</Navbar>
		</>
	);
}
