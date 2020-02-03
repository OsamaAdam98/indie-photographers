import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import axios from "axios";
import {FAB} from "../index";
import EditIcon from "@material-ui/icons/Edit";
import useWindowDimensions from "../utilities/WindowDimensions";
import {
	Dialog,
	DialogActions,
	DialogTitle,
	DialogContent,
	TextField,
	Button,
	makeStyles
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	input: {
		display: "none"
	}
}));

export default function PostModal(props) {
	const {
		isLogged,
		user,
		setNewPost,
		photo,
		isUploading,
		onUpload,
		offline,
		show,
		setShow,
		handleCancel
	} = props;

	const classes = useStyles();
	const history = useHistory();
	const {height} = useWindowDimensions();
	const [errorMsg, setErrorMsg] = useState("");
	const [msg, setMsg] = useState("");

	const msgChange = (event) => setMsg(event.target.value);

	const handleClose = () => {
		setErrorMsg("");
		setShow(false);
		if (props.location.hash === "#feed-post") history.goBack();
	};

	const handleShow = () => {
		setShow(true);
		setErrorMsg("");
		window.location.hash = "feed-post";
	};

	const handleSubmit = (event) => {
		const username = user.username;
		const email = user.email;
		if (!msg && !photo) {
			setErrorMsg("Surely you'd like to write something!");
		} else {
			const subData = {
				username,
				email,
				msg,
				photo: photo.eager[0].secure_url,
				photoId: photo.public_id
			};
			const token = localStorage.getItem("token");

			axios
				.post("/api/feed/add", subData, {
					headers: {
						"x-auth-token": `${token}`
					}
				})
				.then((res) => {
					setNewPost((prevPost) => [res.data, ...prevPost]);
					localStorage.setItem(
						`feedPage1`,
						JSON.stringify([
							res.data,
							...JSON.parse(localStorage.getItem(`feedPage1`))
						])
					);
					handleClose();
				})
				.catch((err) => {
					setErrorMsg(err.response.data);
				});
		}

		event.preventDefault();
	};

	const subButton = isLogged ? (
		<FAB
			handleClick={handleShow}
			offline={offline}
			currentLocation="/feed/"
			icon={<EditIcon />}
		/>
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
				transitionDuration={0}
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
							error={errorMsg ? true : false}
							helperText={errorMsg}
						/>
						<img
							src={photo && photo.eager[0].secure_url}
							alt="uploaded"
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
								className={classes.input}
								id="outlined-button-file"
								type="file"
								onChange={onUpload}
							/>
							<label htmlFor="outlined-button-file">
								<Button component="span" color="primary" disabled={isUploading}>
									Upload
								</Button>
							</label>
						</div>

						<Button
							onClick={handleSubmit}
							color="primary"
							disabled={isUploading}
						>
							Post
						</Button>
						<Button onClick={handleCancel}>Cancel</Button>
					</DialogActions>
				</form>
			</Dialog>
		</>
	);
}
