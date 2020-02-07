import React, {useState} from "react";
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
	const {photo, username, maxHeight} = props;

	const [show, setShow] = useState(false);

	const history = useHistory();
	const classes = useStyles();

	const exiting = () => {
		if (props.location.hash === "") setShow(false);
	};

	const handleShow = () => {
		setShow(true);
		window.location.hash = "photo-preview";
	};

	const handleClose = () => {
		setShow(false);
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
				open={show}
				fullWidth={true}
				className={classes.dialog}
				onClick={handleClose}
				onExiting={exiting}
				transitionDuration={{
					enter: 0,
					exit: 0
				}}
			>
				<FullImage />
			</Dialog>
		</>
	);
}
