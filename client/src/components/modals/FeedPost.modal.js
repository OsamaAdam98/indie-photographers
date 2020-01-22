import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import axios from "axios";
import FAB from "../FAB";
import EditIcon from "@material-ui/icons/Edit";
import {makeStyles} from "@material-ui/styles";
import useWindowDimensions from "../utilities/WindowDimensions";
import {
	Dialog,
	DialogActions,
	DialogTitle,
	DialogContent,
	TextField,
	Button
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	input: {
		display: "none"
	},
	buttonDivStyle: {
		width: "100%",
		marginTop: "1rem"
	},
	buttonStyle: {
		width: "100%"
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
		show,
		setShow
	} = props;

	const classes = useStyles();
	const history = useHistory();
	const {height} = useWindowDimensions();

	const [errorMsg, setErrorMsg] = useState("");
	const [msg, setMsg] = useState("");
	const [selfShow, setSelfShow] = useState(false);

	const msgChange = (event) => setMsg(event.target.value);

	const handleClose = () => {
		setSelfShow(false);
		setErrorMsg("");
		if (props.location.hash === "#feed-post") history.goBack();
	};

	const handleShow = () => {
		setSelfShow(true);
		setShow(true);
		setErrorMsg("");
		window.location.hash = "feed-post";
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
			.then((res) => {
				setNewPost(res.data);
				localStorage.setItem(
					`feedPage1`,
					JSON.stringify([
						res.data,
						...JSON.parse(localStorage.getItem(`feedPage1`))
					])
				);
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
			<Dialog
				open={show && selfShow}
				onClose={handleClose}
				aria-labelledby="form-dialog-title"
				fullWidth={true}
				maxWidth="xs"
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
							autoFocus={true}
							fullWidth={true}
						/>
						<img
							src={photo}
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
						{subError}
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
								multiple
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
						<Button onClick={handleClose}>Cancel</Button>
					</DialogActions>
				</form>
			</Dialog>
		</>
	);
}
