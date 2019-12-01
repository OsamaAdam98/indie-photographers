import React, {useState} from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";

export default function Post(props) {
	const {isLogged, user} = props;

	const [show, setShow] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");

	const [imgUrl, setImgUrl] = useState("");
	const [title, setTitle] = useState("");
	const [desc, setDesc] = useState("");

	const handleClose = () => {
		setShow(false);
		setErrorMsg("");
	};

	const handleShow = () => {
		setShow(true);
		setErrorMsg("");
	};

	const imgUrlChange = (event) => setImgUrl(event.target.value);
	const titleChange = (event) => setTitle(event.target.value);
	const descChange = (event) => setDesc(event.target.value);

	const handleSubmit = (event) => {
		const name = user.username;
		const postData = {
			imgUrl,
			title,
			name,
			desc
		};
		const token = localStorage.getItem("token");

		axios
			.post("/api/items/add", postData, {
				headers: {
					"x-auth-token": `${token}`
				}
			})
			.then(() => handleClose())
			.catch((err) => console.log(err));
		event.preventDefault();
	};

	const postButton =
		isLogged && user.admin ? (
			<button
				type="button"
				className="btn btn-outline-light mr-3"
				onClick={handleShow}
			>
				Post
			</button>
		) : null;

	const postError = errorMsg ? (
		<div className="alert alert-danger" role="alert">
			{errorMsg}
		</div>
	) : null;
	return (
		<>
			{postButton}
			<Modal show={show} onHide={handleClose}>
				<form onSubmit={handleSubmit}>
					<Modal.Header closeButton>
						<Modal.Title>Post</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="form-group">
							<label htmlFor="url-input">Image source</label>
							<input
								type="url"
								className="form-control"
								id="url-input"
								value={imgUrl}
								onChange={imgUrlChange}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="title-input">Title</label>
							<input
								type="text"
								className="form-control"
								id="title-input"
								value={title}
								onChange={titleChange}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="title-input">Description</label>
							<textarea
								type="text"
								className="form-control"
								id="desc-input"
								value={desc}
								onChange={descChange}
							/>
						</div>
						{postError}
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
