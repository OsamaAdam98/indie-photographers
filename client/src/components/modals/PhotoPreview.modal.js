import React, {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";
import {Dialog, makeStyles} from "@material-ui/core";
import {useWindowDimensions} from "..";

const useStyles = makeStyles({
	preview: {
		"&:hover": {
			cursor: "pointer"
		}
	}
});

export default function PhotoPreview(props) {
	const {photo, username, show, setShow, maxHeight} = props;
	const {height, width} = useWindowDimensions();

	const [selfShow, setSelfShow] = useState(false);

	const history = useHistory();
	const classes = useStyles();

	useEffect(() => {
		if (props.location.hash === "") handleClose();
		// eslint-disable-next-line
	}, [props.location.hash]);

	const handleShow = () => {
		setSelfShow(true);
		setShow(true);
		window.location.hash = "photo-preview";
	};

	const handleClose = () => {
		setSelfShow(false);
		if (props.location.hash === "#photo-preview") history.goBack();
	};

	const imagePreview = (
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

	const fullImage = (
		<img
			src={photo}
			alt={`max width and height`}
			style={{
				objectFit: "contain",
				objectPosition: "50% 50%",
				maxWidth: `${width}px`,
				maxHeight: `${0.9 * height}px`
			}}
		/>
	);

	return (
		<>
			{imagePreview}
			<Dialog
				open={show && selfShow}
				onClose={handleClose}
				fullWidth={true}
				style={{
					display: "flex",
					justifyContent: "center"
				}}
			>
				{fullImage}
			</Dialog>
		</>
	);
}
