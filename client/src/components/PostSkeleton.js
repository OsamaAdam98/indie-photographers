import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Skeleton from "@material-ui/lab/Skeleton";
import {CardActions} from "@material-ui/core";
import ShareIcon from "@material-ui/icons/Share";
import FavoriteIcon from "@material-ui/icons/Favorite";

const useStyles = makeStyles((theme) => ({
	card: {
		maxWidth: 500,
		margin: theme.spacing(2)
	},
	media: {
		height: 250
	}
}));
export default function PostSkeleton() {
	const classes = useStyles();

	return (
		<>
			<Card className={classes.card}>
				<CardHeader
					avatar={<Skeleton variant="circle" width={40} height={40} />}
					title={<Skeleton height={10} width="80%" style={{marginBottom: 6}} />}
					subheader={<Skeleton height={10} width="40%" />}
				/>
				<CardContent>
					{
						<React.Fragment>
							<Skeleton height={10} style={{marginBottom: 6}} />
							<Skeleton height={10} width="80%" />
						</React.Fragment>
					}
				</CardContent>

				<Skeleton variant="rect" className={classes.media} />
				<CardActions disableSpacing>
					<IconButton aria-label="add to favorites">
						<FavoriteIcon />
					</IconButton>
					<IconButton aria-label="share">
						<ShareIcon />
					</IconButton>
				</CardActions>
			</Card>
		</>
	);
}
