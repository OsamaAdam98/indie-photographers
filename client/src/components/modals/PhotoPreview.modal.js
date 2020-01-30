import React, {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";
import {Dialog, makeStyles} from "@material-ui/core";

const useStyles = makeStyles({
	preview: {
		"&:hover": {
			cursor: "pointer"
		}
	},
	fullPrev: {
		objectFit: "contain",
		objectPosition: "50% 50%",
		maxWidth: `100vw`,
		maxHeight: `100vh`,
		overflow: "hidden"
	},
	dialog: {
		display: "flex",
		justifyContent: "center"
	}
});

export default function PhotoPreview(props) {
	const {photo, username, show, setShow, maxHeight} = props;

	const [selfShow, setSelfShow] = useState(false);

	const history = useHistory();
	const classes = useStyles();

	useEffect(() => {
		if (props.location.hash === "") setSelfShow(false);
	}, [props.location.hash]);

	const handleShow = () => {
		setSelfShow(true);
		setShow(true);
		window.location.hash = "photo-preview";
	};

	const handleClose = () => {
		setSelfShow(false);
		if (window.location.hash === "#photo-preview") history.goBack();
	};

	const ImagePreview = () => (
		<img
			className={classes.preview}
			src={photo}
			alt={`by, ${username}`}
			onClick={handleShow}
			style={{
				objectFit: "cover",
				objectPosition: "50% 50%",
				width: "100%",
				maxHeight: maxHeight
			}}
		/>
	);

	const FullImage = () => (
		<img
			src={photo}
			alt={`max width and height`}
			className={classes.fullPrev}
		/>
	);

	return (
		<>
			<ImagePreview />
			<Dialog
				open={show && selfShow}
				onClose={handleClose}
				fullWidth={true}
				className={classes.dialog}
				onKeyUp={handleClose}
			>
				<FullImage />
			</Dialog>
		</>
	);
}
