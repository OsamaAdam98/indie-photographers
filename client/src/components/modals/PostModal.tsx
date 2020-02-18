import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {useLocation, useHistory} from "react-router-dom";
import {FAB} from "../index";
import useWindowDimensions from "../utilities/WindowDimensions";

interface Props {
	isLogged: boolean;
	user: User;
	photo: string;
	setPhoto: React.Dispatch<React.SetStateAction<string>>;
	realPhoto: Blob | undefined;
	isUploading: boolean;
	offline: boolean;
	setNewPost: React.Dispatch<React.SetStateAction<Post[]>>;
	setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
	handleCancel: () => void;
	onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const url = process.env.NODE_ENV === "production" ? process.env.REACT_APP_PROXY : "";

const PostModal: React.FC<Props> = (props) => {
	const {
		isLogged,
		user,
		setNewPost,
		photo,
		setPhoto,
		isUploading,
		onUpload,
		offline,
		handleCancel,
		realPhoto,
		setIsUploading
	} = props;

	const history = useHistory();
	const location = useLocation();
	const {height} = useWindowDimensions();
	const [show, setShow] = useState<boolean>(false);
	const [errorMsg, setErrorMsg] = useState<string>("");
	const [msg, setMsg] = useState<string>("");

	useEffect(() => {
		if (location.hash !== "#feed-post") setShow(false);
	}, [location.hash]);

	const msgChange = (event: React.ChangeEvent<HTMLInputElement>) => setMsg(event.target.value);

	const handleClose = () => {
		setErrorMsg("");
		setMsg("");
		setPhoto("");
		setShow(false);
		if (location.hash === "#feed-post") history.goBack();
	};

	const handleShow = () => {
		window.location.hash = "feed-post";
		setShow(true);
		setErrorMsg("");
	};

	const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>) => {
		const username: string | undefined = user.username;
		const email: string | undefined = user.email;
		const formData = new FormData();
		let subData: SubPost;
		if (!msg.trim() && !photo.trim()) {
			setErrorMsg("Surely you'd like to write something!");
		} else {
			if (realPhoto) {
				setIsUploading(true);
				formData.append("image", realPhoto);
			}

			const token = localStorage.getItem("token");

			subData = {
				username,
				email,
				msg
			};

			formData.append("data", JSON.stringify(subData));

			axios
				.post(`${url}/api/feed/add`, formData, {
					headers: {
						"x-auth-token": `${token}`
					}
				})
				.then((res) => {
					setNewPost((prevPost) => [...prevPost, res.data]);
					setPhoto("");
					setMsg("");
					setIsUploading(false);
					handleClose();
				})
				.catch((err) => {
					setErrorMsg(err.response.data);
				});
		}
		event.preventDefault();
	};

	const subButton = isLogged ? (
		<FAB handleClick={handleShow} offline={offline} currentLocation="/feed/" icon={<EditIcon />} />
	) : null;

	return (
		<>
			{subButton}
			<Dialog
				open={show}
				onClose={handleClose}
				aria-labelledby="form-dialog-title"
				fullWidth={true}
				maxWidth="xs"
				transitionDuration={{
					enter: 0,
					exit: 0
				}}
			>
				<form onSubmit={handleSubmit}>
					<DialogTitle id="form-dialog-title">Post</DialogTitle>
					<DialogContent>
						<TextField
							id="outlined-textarea"
							label="Message"
							placeholder="What's on your mind?"
							multiline
							variant="outlined"
							value={msg}
							onChange={msgChange}
							fullWidth={true}
							dir="auto"
							error={errorMsg.trim() ? true : false}
							helperText={errorMsg}
						/>
						<img
							src={photo}
							alt=""
							style={{
								objectFit: "scale-down",
								objectPosition: "50% 50%",
								display: photo ? `flex` : `none`,
								width: "100%",
								alignItems: "center",
								marginTop: "1rem",
								maxHeight: `${height / 2}px`
							}}
						/>
					</DialogContent>
					<DialogActions>
						<div
							style={{
								position: "absolute",
								left: "1rem"
							}}
						>
							<input
								accept="image/*"
								style={{display: "none"}}
								id="outlined-button-file"
								type="file"
								onChange={onUpload}
							/>
							<label htmlFor="outlined-button-file">
								<Button component="span" color="primary" disabled={isUploading}>
									Upload photo
								</Button>
							</label>
						</div>

						<Button onClick={handleSubmit} color="primary" disabled={isUploading}>
							Post
						</Button>
						<Button onClick={handleCancel}>Cancel</Button>
					</DialogActions>
				</form>
			</Dialog>
		</>
	);
};

export default PostModal;
