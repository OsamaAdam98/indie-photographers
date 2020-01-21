import React, {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";
import axios from "axios";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FAB from "../FAB";
import EditIcon from "@material-ui/icons/Edit";
import {LinearProgress} from "@material-ui/core";
import {PhotoCamera} from "@material-ui/icons";
import {makeStyles} from "@material-ui/styles";

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
	},
	iconStyle: {
		marginRight: "1rem"
	}
}));

export default function PostModal(props) {
	const {isLogged, user, setNewPost} = props;

	const classes = useStyles();
	const history = useHistory();

	const [show, setShow] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const [msg, setMsg] = useState("");
	const [photo, setPhoto] = useState("");
	const [uploadProgress, setUploadProgress] = useState(0);
	const [isUploading, setIsUploading] = useState(false);

	useEffect(() => {
		if (props.location.hash === "") setShow(false);
	}, [props.location.hash]);

	const onUpload = (e) => {
		const files = e.target.files;
		console.log("Clicked");

		const formData = new FormData();
		formData.append("file", files[0]);
		formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);
		axios
			.post(process.env.REACT_APP_CLOUDINARY_URL, formData, {
				onUploadProgress: (progress) => {
					setIsUploading(true);
					setUploadProgress((progress.loaded / progress.total) * 100);
					console.log((progress.loaded / progress.total) * 100);
				}
			})
			.then((res) => {
				setIsUploading(false);
				const {secure_url} = res.data;
				setPhoto(secure_url);
			})
			.catch((err) => {
				if (err) setErrorMsg("Upload failed!");
			});
	};

	const msgChange = (event) => setMsg(event.target.value);

	const handleClose = () => {
		setShow(false);
		setErrorMsg("");
		if (props.location.hash === "#modal") history.goBack();
	};

	const handleShow = () => {
		setShow(true);
		setErrorMsg("");
		window.location.hash = "modal";
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

		if (isUploading) {
			setErrorMsg("Picture still uploading..");
		} else {
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
		}
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
				open={show}
				onClose={handleClose}
				aria-labelledby="form-dialog-title"
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
						/>
						<div className={classes.buttonDivStyle}>
							<input
								accept="image/*"
								className={classes.input}
								id="outlined-button-file"
								multiple
								type="file"
								onChange={onUpload}
							/>
							<label htmlFor="outlined-button-file">
								<Button
									variant="outlined"
									color="primary"
									component="span"
									className={classes.buttonStyle}
								>
									<PhotoCamera className={classes.iconStyle} />
									Upload
								</Button>
							</label>
						</div>
						{isUploading ? (
							<LinearProgress variant="determinate" value={uploadProgress} />
						) : null}
						{subError}
					</DialogContent>
					<DialogActions>
						<Button onClick={handleSubmit} color="primary">
							Post
						</Button>
						<Button onClick={handleClose}>Cancel</Button>
					</DialogActions>
				</form>
			</Dialog>
		</>
	);
}
