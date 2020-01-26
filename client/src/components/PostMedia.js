import React, {useState} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {
	CardActions,
	CardActionArea,
	Menu,
	MenuItem,
	makeStyles,
	Card,
	CardHeader,
	CardContent,
	CardMedia,
	Avatar,
	Typography,
	IconButton
} from "@material-ui/core";
import ShareIcon from "@material-ui/icons/Share";
import FavoriteIcon from "@material-ui/icons/Favorite";
import {Likes, PhotoPreview} from "./index";

const useStyles = makeStyles((theme) => ({
	card: {
		maxWidth: 500,
		margin: theme.spacing(2)
	},
	media: {
		maxHeight: 250
	}
}));

export default function PostMedia(props) {
	const {
		currentUser,
		handleDelete,
		feedPost,
		showLikes,
		setShowLikes,
		showPrev,
		setShowPrev
	} = props;
	const {user} = feedPost;
	const classes = useStyles();

	const [anchorEl, setAnchorEl] = useState(null);
	const [likes, setLikes] = useState(feedPost.likes.length);
	const [liked, setLiked] = useState(
		feedPost.likes.filter((like) => like.user._id === currentUser._id).length
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
	if (hoursOffset === 1) {
		minutesOffset = 60 - date.getMinutes() + today.getMinutes();
	} else if (hoursOffset) {
		minutesOffset =
			60 - date.getMinutes() + today.getMinutes() + hoursOffset * 60;
	}

	if (user) {
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
						currentUser._id === feedPost.user._id || currentUser.admin ? (
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
						<Link to={`/profile/${user._id}`} className="text-link">
							<Typography variant="subtitle1" color="inherit">
								{user.username}
							</Typography>
						</Link>
					}
					subheader={
						monthsOffset === 1 && daysOffset < 30
							? `Posted ${daysOffset} days ago`
							: monthsOffset === 1 && daysOffset > 30
							? `Posted about a month ago`
							: monthsOffset
							? `Posted ${monthsOffset} months ago`
							: daysOffset === 1
							? `Posted yesterday`
							: daysOffset
							? `Posted ${daysOffset} days ago`
							: hoursOffset === 1 && minutesOffset < 60
							? `Posted ${minutesOffset} minutes ago`
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
					<CardActionArea>
						<CardMedia className={classes.media}>
							<PhotoPreview
								show={showPrev}
								setShow={setShowPrev}
								photo={feedPost.photo}
								username={feedPost.user.username}
								maxHeight={250}
								{...props}
							/>
						</CardMedia>
					</CardActionArea>
				) : (
					""
				)}
				<Likes
					likes={likes}
					users={feedPost && feedPost.likes.map((like) => like.user)}
					show={showLikes}
					setShow={setShowLikes}
					{...props}
				/>
				<CardActions disableSpacing>
					<IconButton
						aria-label="love"
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
	} else {
		return null;
	}
}

PostMedia.propTypes = {
	isLoading: PropTypes.bool
};
