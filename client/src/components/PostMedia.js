import React from "react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Skeleton from "@material-ui/lab/Skeleton";

const useStyles = makeStyles((theme) => ({
	card: {
		maxWidth: 500,
		margin: theme.spacing(2)
	},
	media: {
		height: 190
	}
}));

export default function PostMedia(props) {
	const {isLoading} = props;
	const {user, post} = props.feedPost;
	const classes = useStyles();

	const today = new Date();
	let date = new Date(post.date);

	let hoursOffset = today.getHours() - date.getHours();
	let daysOffset = today.getDate() - date.getDate();

	return (
		<Card className={classes.card}>
			<CardHeader
				avatar={
					isLoading ? (
						<Skeleton variant="circle" width={40} height={40} />
					) : (
						<Link to={`/profile/${user.id}`}>
							<Avatar
								alt="user avatar"
								src={user.profilePicture ? user.profilePicture : ""}
							/>
						</Link>
					)
				}
				action={
					isLoading ? null : (
						<IconButton aria-label="settings">
							<MoreVertIcon />
						</IconButton>
					)
				}
				title={
					isLoading ? (
						<Skeleton height={10} width="80%" style={{marginBottom: 6}} />
					) : (
						<Link to={`/profile/${user.id}`}>
							<div style={{fontWeight: "bold"}}>{user.username}</div>
						</Link>
					)
				}
				subheader={
					isLoading ? (
						<Skeleton height={10} width="40%" />
					) : daysOffset === 0 ? (
						`Posted ${hoursOffset} hours ago`
					) : daysOffset === 1 ? (
						`Posted yesterday`
					) : (
						`Posted ${daysOffset} days ago`
					)
				}
			/>
			<CardContent>
				{isLoading ? (
					<React.Fragment>
						<Skeleton height={10} style={{marginBottom: 6}} />
						<Skeleton height={10} width="80%" />
					</React.Fragment>
				) : (
					<Typography variant="body2" component="p">
						{post.msg}
					</Typography>
				)}
			</CardContent>

			{isLoading ? (
				<Skeleton variant="rect" className={classes.media} />
			) : post.photo ? (
				<CardMedia
					className={classes.media}
					image={post.photo}
					title="feedPost image"
				/>
			) : (
				""
			)}

			<CardContent></CardContent>
		</Card>
	);
}

PostMedia.propTypes = {
	isLoading: PropTypes.bool
};
