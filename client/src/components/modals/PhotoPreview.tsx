import { Dialog, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

const useStyles = makeStyles({
	fullPrev: {
		objectFit: "contain",
		maxWidth: "100vw",
		maxHeight: "100vh",
		margin: "auto"
	},
	dialog: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignContent: "center"
	}
});

interface Props {
	photo?: string;
	realPhoto?: Photo;
	alt: string;
	maxHeight?: number;
	round?: boolean;
}

const PhotoPreview: React.FC<Props> = (props) => {
	const { photo, maxHeight, round, alt, realPhoto } = props;

	const [show, setShow] = useState(false);

	const history = useHistory();
	const location = useLocation();
	const classes = useStyles();

	useEffect(() => {
		if (location.hash !== "#photo-preview") setShow(false);
	}, [location.hash]);

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
			src={realPhoto?.secure_url || photo}
			alt={alt}
			onClick={handleShow}
			style={{
				objectFit: "cover",
				objectPosition: "50% 50%",
				width: "100%",
				maxHeight: maxHeight ? maxHeight : ""
			}}
			className={`hover-img ${round ? "profile-photo" : ""}`}
		/>
	);

	const FullImage = () => (
		<img
			src={realPhoto?.secure_url?.trim() ? realPhoto.secure_url : photo}
			alt={`max width and height`}
			className={`hover-img ${classes.fullPrev}`}
		/>
	);

	return (
		<>
			<ImagePreview />
			<Dialog
				open={show}
				fullScreen
				className={classes.dialog}
				onClick={handleClose}
				transitionDuration={{
					enter: 0,
					exit: 0
				}}
			>
				<FullImage />
			</Dialog>
		</>
	);
};

export default PhotoPreview;
