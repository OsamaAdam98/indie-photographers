import React, {useState, useEffect} from "react";
import {useHistory, useLocation} from "react-router-dom";
import {Dialog, makeStyles} from "@material-ui/core";

const useStyles = makeStyles({
	fullPrev: {
		objectFit: "contain",
		objectPosition: "50% 50%",
		maxWidth: `100vw`,
		maxHeight: `100vh`,
		overflow: "hidden"
	},
	dialog: {
		display: "flex",
		justifyContent: "center",
		alignContent: "center"
	}
});

interface Props {
	photo: string | undefined | null;
	alt: string;
	maxHeight?: number;
	round?: boolean;
}

const PhotoPreview: React.FC<Props> = (props) => {
	const {photo, maxHeight, round, alt} = props;

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
			src={photo ? photo : ""}
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
			src={photo ? photo : ""}
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
