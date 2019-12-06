import React, {useState} from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import "../../css/modal.css";
import FAB from "../FAB";
import EditIcon from "@material-ui/icons/Edit";

export default function PostModal(props) {
	const {isLogged, user} = props;

	const [show, setShow] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");

	const [msg, setMsg] = useState("");

	const msgChange = (event) => setMsg(event.target.value);

	const handleClose = () => {
		setShow(false);
		setErrorMsg("");
	};

	const handleShow = () => {
		setShow(true);
		setErrorMsg("");
	};

	const handleSubmit = (event) => {
		const username = user.username;
		const email = user.email;
		const subData = {
			username,
			email,
			msg
		};
		const token = localStorage.getItem("token");

		axios
			.post("/api/feed/add", subData, {
				headers: {
					"x-auth-token": `${token}`
				}
			})
			.then(() => {
				handleClose();
				window.location = "/feed";
			})
			.catch((err) => console.log(err));
		event.preventDefault();
	};

	const subButton = isLogged ? (
		<FAB
			handleClick={handleShow}
			currentLocation="/feed/"
			icon={<EditIcon />}
		/>
	) : null;

	const subError = errorMsg ? (
		<div className="alert alert-danger" role="alert">
			{errorMsg}
		</div>
	) : null;
	return (
		<>
			{subButton}
			<Modal show={show} onHide={handleClose} dialogClassName="custom-dialog">
				<form onSubmit={handleSubmit}>
					<Modal.Header closeButton>
						<Modal.Title>Post</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="form-group">
							<label htmlFor="msg-input">Message</label>
							<textarea
								type="text"
								className="form-control"
								id="msg-input"
								value={msg}
								onChange={msgChange}
							/>
						</div>
						{subError}
					</Modal.Body>
					<Modal.Footer>
						<button
							type="submit"
							className="btn btn-primary"
							onClick={handleSubmit}
						>
							Post
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
