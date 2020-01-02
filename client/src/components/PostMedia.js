import React, {useState} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
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
import {CardActions} from "@material-ui/core";
import ShareIcon from "@material-ui/icons/Share";
import FavoriteIcon from "@material-ui/icons/Favorite";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Likes from "./modals/Likes.modal";

const useStyles = makeStyles((theme) => ({
	card: {
		maxWidth: 500,
		margin: theme.spacing(2)
	},
	media: {
		height: 250
	}
}));

export default function PostMedia(props) {
	const {currentUser, handleDelete, feedPost} = props;
	const {user} = feedPost;
	const classes = useStyles();

	const [anchorEl, setAnchorEl] = useState(null);
	const [likes, setLikes] = useState(feedPost.likes.length);
	const [liked, setLiked] = useState(
		feedPost.likes.filter((like) => like.user === currentUser._id).length
			? true
			: false
	);

	const open = Boolean(anchorEl);

	const handleLike = (id) => {
		const token = localStorage.getItem("token");
		axios
			.post(`/api/feed/like/${id}`, null, {
				headers: {
					"x-auth-token": `${token}`
				}
			})
			.then((res) => {
				const {like} = res.data;
				setLiked(like);
				setLikes((prevNumber) => (like ? prevNumber + 1 : prevNumber - 1));
			})
			.catch((err) => console.log(err));
	};

	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const today = new Date();
	let date = new Date(feedPost.date);
	let yearOffset = today.getFullYear() - date.getFullYear();
	let monthsOffset = today.getMonth() - date.getMonth();
	let hoursOffset = today.getHours() - date.getHours();
	let daysOffset = today.getDate() - date.getDate();
	let minutesOffset = today.getMinutes() - date.getMinutes();

	const daysInAMonth = (month, year) => {
		return new Date(year, month, 0).getDate();
	};

	if (yearOffset) {
		monthsOffset =
			12 - date.getMonth() + today.getMonth() + 12 * (yearOffset - 1);
	}
	if (monthsOffset === 1 && daysOffset < 31) {
		daysOffset =
			daysInAMonth(date.getMonth(), date.getFullYear()) -
			date.getDate() +
			today.getDate();
	}

	return (
		<Card className={classes.card}>
			<CardHeader
				avatar={
					<Link to={`/profile/${user._id}`}>
						<Avatar
							alt="user avatar"
							src={user.profilePicture ? user.profilePicture : ""}
						/>
					</Link>
				}
				action={
					currentUser._id === feedPost.user._id ? (
						<>
							<IconButton
								aria-label="settings"
								aria-controls="menu-appbar"
								aria-haspopup="true"
								onClick={handleMenu}
								color="inherit"
							>
								<MoreVertIcon />
							</IconButton>
							<Menu
								id="simple-menu"
								anchorEl={anchorEl}
								anchorOrigin={{
									vertical: "top",
									horizontal: "right"
								}}
								keepMounted
								transformOrigin={{
									vertical: "top",
									horizontal: "right"
								}}
								open={open}
								onClose={handleClose}
							>
								<MenuItem>Edit</MenuItem>
								<MenuItem onClick={() => handleDelete(feedPost._id)}>
									Delete
								</MenuItem>
							</Menu>
						</>
					) : null
				}
				title={
					<Link to={`/profile/${user._id}`}>
						<div style={{fontWeight: "bold"}}>{user.username}</div>
					</Link>
				}
				subheader={
					monthsOffset === 1
						? `Posted ${daysOffset} days ago`
						: monthsOffset
						? `Posted ${monthsOffset} months ago`
						: daysOffset === 1
						? `Posted yesterday`
						: daysOffset
						? `Posted ${daysOffset} days ago`
						: hoursOffset === 1
						? "Posted about an hour ago"
						: hoursOffset
						? `Posted ${hoursOffset} hours ago`
						: minutesOffset
						? `Posted ${minutesOffset} minutes ago`
						: `Posted just now`
				}
			/>
			<CardContent>
				<Typography variant="body2" component="p">
					{feedPost.msg}
				</Typography>
			</CardContent>

			{feedPost.photo ? (
				<CardMedia
					className={classes.media}
					image={feedPost.photo}
					title="feedPost image"
				/>
			) : (
				""
			)}
			<Likes likes={likes} post={feedPost} />
			<CardActions disableSpacing>
				<IconButton
					aria-label="add to favorites"
					onClick={() => handleLike(feedPost._id)}
				>
					<FavoriteIcon color={liked ? "secondary" : "disabled"} />
				</IconButton>
				<IconButton aria-label="share">
					<ShareIcon />
				</IconButton>
			</CardActions>
		</Card>
	);
}

PostMedia.propTypes = {
	isLoading: PropTypes.bool
};
