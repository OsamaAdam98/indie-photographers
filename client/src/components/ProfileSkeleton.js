import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Skeleton from "@material-ui/lab/Skeleton";

const useStyles = makeStyles((theme) => ({
	card: {
		maxWidth: 500,
		margin: theme.spacing(2)
	},
	media: {
		height: 200
	}
}));
export default function ProfileSkeleton() {
	const classes = useStyles();

	return (
		<>
			<Card className={classes.card}>
				<Skeleton variant="rect" className={classes.media} />
				<CardContent>
					<CardHeader
						title={
							<Skeleton height={10} width="80%" style={{marginBottom: 6}} />
						}
						subheader={<Skeleton height={10} width="40%" />}
					/>
					{
						<React.Fragment>
							<Skeleton height={10} style={{marginBottom: 6}} />
							<Skeleton height={10} width="80%" />
						</React.Fragment>
					}
				</CardContent>
			</Card>
		</>
	);
}
