import React from "react";
import {Skeleton} from "@material-ui/lab";
import {makeStyles, Card, CardContent, CardHeader} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	card: {
		margin: theme.spacing(2),
		width: "100%"
	},
	media: {
		height: 345
	}
}));
export default function ProfileSkeleton() {
	const classes = useStyles();

	return (
		<div>
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
		</div>
	);
}
