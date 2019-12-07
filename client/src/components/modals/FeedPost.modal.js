import React, {useState} from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import "../../css/modal.css";
import FAB from "../FAB";
import EditIcon from "@material-ui/icons/Edit";
import {IconButton} from "@material-ui/core";
import {PhotoCamera} from "@material-ui/icons";
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
	input: {
		display: "none"
	}
}));

export default function PostModal(props) {
	const {isLogged, user} = props;

	const classes = useStyles();

	const [show, setShow] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const [msg, setMsg] = useState("");
	const [photo, setPhoto] = useState("");

	const onUpload = (e) => {
		const files = e.target.files;

		const formData = new FormData();
		formData.append("file", files[0]);
		formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);
		axios
			.post(process.env.REACT_APP_CLOUDINARY_URL, formData)
			.then((res) => {
				console.log(res.data);
				const {secure_url} = res.data;
				setPhoto(secure_url);
			})
			.catch((err) => console.log(err));
	};

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
			msg,
			photo
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
						<input
							className={classes.input}
							id="icon-button-file"
							name="file"
							type="file"
							onChange={onUpload}
						/>
						<label htmlFor="icon-button-file">
							<IconButton
								color="primary"
								aria-label="upload picture"
								component="span"
							>
								<PhotoCamera />
							</IconButton>
						</label>
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
