import React, {lazy, Suspense} from "react";
import {Skeleton} from "@material-ui/lab";
import {
	Grid,
	Box,
	Card,
	CardActionArea,
	CardMedia,
	CardContent,
	CardActions,
	Button,
	Typography,
	makeStyles
} from "@material-ui/core";

const PhotoPreview = lazy(() => import("./modals/PhotoPreview.modal"));

const useStyles = makeStyles((theme) => ({
	card: {
		maxWidth: 500,
		margin: theme.spacing(2)
	},
	cardMedia: {
		maxHeight: 345
	},
	placeHolderMedia: {
		height: 345
	}
}));

export default function ProfileCard(props) {
	const {width, pic, username, show, setShow} = props;
	const classes = useStyles();

	return (
		<Grid container direction="column" alignItems="center" justify="center">
			<Box minWidth={`${width < 345 ? `100%` : ``}`}>
				<Card className={classes.card}>
					<CardActionArea>
						<CardMedia className={classes.cardMedia}>
							<Suspense
								fallback={
									<Skeleton
										variant="rect"
										className={classes.placeHolderMedia}
									/>
								}
							>
								<PhotoPreview
									photo={pic}
									username={username}
									maxHeight={345}
									show={show}
									setShow={setShow}
									{...props}
								/>
							</Suspense>
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
