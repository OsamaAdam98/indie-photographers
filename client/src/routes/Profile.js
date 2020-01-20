import React, {useState, useEffect} from "react";
import axios from "axios";
import {Grid, Box} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ProfileSkeleton from "../components/ProfileSkeleton";
import useWindowDimensions from "../components/utilities/WindowDimensions";

const useStyles = makeStyles((theme) => ({
	card: {
		maxWidth: 345,
		margin: theme.spacing(2)
	}
}));

export default function Profile(props) {
	const [username, setUsername] = useState("");
	const [pic, setPic] = useState("");
	const [isLoading, setIsloading] = useState(true);

	const {width} = useWindowDimensions();

	const classes = useStyles();

	useEffect(() => {
		setIsloading(true);
		axios
			.get(`/api/users/profile/${props.match.params.id}`)
			.then((res) => {
				const {data} = res;
				let cachedProfile = localStorage.getItem(`${props.match.params.id}`);
				if (cachedProfile) {
					const {username, profilePicture} = JSON.parse(cachedProfile);
					setUsername(username);
					setPic(profilePicture);
					setIsloading(false);
				} else {
					setUsername(data.username);
					setPic(data.profilePicture);
				}
				setIsloading(false);
				localStorage.setItem(`${props.match.params.id}`, JSON.stringify(data));
			})
			.catch((err) => console.log(err));
		// eslint-disable-next-line
	}, []);

	if (isLoading) {
		return (
			<Grid container direction="column" alignItems="center" justify="center">
				{width > 345 ? (
					<Box width="345px">
						<ProfileSkeleton />
					</Box>
				) : (
					<Box minWidth="100%">
						<ProfileSkeleton />
					</Box>
				)}
			</Grid>
		);
	} else {
		return (
			<Grid container direction="column" alignItems="center" justify="center">
				<Box minWidth={`${width < 345 ? `100%` : ``}`}>
					<Card className={classes.card}>
						<CardMedia
							component="img"
							alt="Profile picture"
							height="345"
							image={pic}
						/>
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
