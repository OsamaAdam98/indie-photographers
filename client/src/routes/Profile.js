import React, {useState, useEffect} from "react";
import axios from "axios";
import ProfileSkeleton from "../components/ProfileSkeleton";
import useWindowDimensions from "../components/utilities/WindowDimensions";
import {
	Grid,
	Box,
	makeStyles,
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	CardMedia,
	Button,
	Typography
} from "@material-ui/core";
import PhotoPreview from "../components/modals/PhotoPreview.modal";

const useStyles = makeStyles((theme) => ({
	card: {
		maxWidth: 500,
		margin: theme.spacing(2)
	},
	cardMedia: {
		maxHeight: 345
	},
	box: {
		marginBottom: "3rem"
	}
}));

export default function Profile(props) {
	const [username, setUsername] = useState("");
	const [pic, setPic] = useState("");
	const [isLoading, setIsloading] = useState(true);
	const [show, setShow] = useState(false);

	useEffect(() => {
		if (props.location.hash === "") setShow(false);
	}, [props.location.hash]);

	const {width} = useWindowDimensions();

	const classes = useStyles();

	useEffect(() => {
		setIsloading(true);
		let cachedProfile = localStorage.getItem(`${props.match.params.id}`);
		if (cachedProfile) {
			const {username, profilePicture} = JSON.parse(cachedProfile);
			setUsername(username);
			setPic(profilePicture);
			setIsloading(false);
		}
		axios
			.get(`/api/users/profile/${props.match.params.id}`)
			.then((res) => {
				const {data} = res;
				if (!cachedProfile) {
					setUsername(data.username);
					setPic(data.profilePicture);
				}
				setIsloading(false);
				localStorage.setItem(`${props.match.params.id}`, JSON.stringify(data));
			})
			.catch((err) => console.log(err));
	}, [props.match.params.id]);

	if (isLoading) {
		return (
			<Grid container direction="column" alignItems="center" justify="center">
				{width > 345 ? (
					<Box width="345px" className={classes.box}>
						<ProfileSkeleton />
					</Box>
				) : (
					<Box minWidth="100%" className={classes.box}>
						<ProfileSkeleton />
					</Box>
				)}
			</Grid>
		);
	} else {
		return (
			<Grid container direction="column" alignItems="center" justify="center">
				<Box minWidth={`${width < 345 ? `100%` : ``}`} className={classes.box}>
					<Card className={classes.card}>
						<CardActionArea>
							<CardMedia className={classes.cardMedia}>
								<PhotoPreview
									photo={pic}
									username={username}
									maxHeight={345}
									show={show}
									setShow={setShow}
									{...props}
								/>
							</CardMedia>
						</CardActionArea>
						<CardActionArea>
							<CardContent>
								<Typography gutterBottom variant="h5" component="h2">
									{username}
								</Typography>
								<Typography variant="body2" color="textSecondary" component="p">
									Do proident irure aute est eiusmod adipisicing dolor
									exercitation amet ex ad aliquip.
								</Typography>
							</CardContent>
						</CardActionArea>
						<CardActions>
							<Button size="small" color="primary">
								Contact
							</Button>
						</CardActions>
					</Card>
				</Box>
			</Grid>
		);
	}
}
