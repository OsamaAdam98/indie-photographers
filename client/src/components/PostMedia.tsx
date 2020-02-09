import React, {useState, memo} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {
	CardActions,
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
import moment from "moment";

const useStyles = makeStyles((theme) => ({
	card: {
		maxWidth: "31.25rem",
		marginBottom: theme.spacing(2)
	},
	media: {
		maxHeight: "15.625rem"
	}
}));

interface Props {
	currentUser: User;
	feedPost: Post;
	handleDelete: (id: string) => void;
}

const PostMedia: React.FC<Props> = (props) => {
	const {currentUser, handleDelete, feedPost} = props;
	const {user} = feedPost;
	const classes = useStyles();

	const [anchorEl, setAnchorEl] = useState<any>(null);
	const [post, setPost] = useState<Post>(feedPost);
	const [liked, setLiked] = useState<boolean>(
		feedPost.likes.filter((like) => like.user._id === currentUser._id).length
			? true
			: false
	);

	const open = Boolean(anchorEl);

	const likeCleanup = (id: string, like: Likes) => {
		let index: number = 1;
		let targetHit: boolean = false;
		let cachedData: Post[];

		do {
			cachedData = JSON.parse(
				localStorage.getItem(`feedPage${index}`) as string
			);
			if (cachedData !== null) {
				targetHit = cachedData.filter((post) => post._id === id).length
					? true
					: false;
				if (targetHit) {
					if (!like) {
						cachedData = cachedData.map((post) => {
							if (post._id === id) {
								post.likes = post.likes.filter(
									(like) => like.user._id !== currentUser._id
								);
								setPost(post);
							}
							return post;
						});
					} else {
						cachedData = cachedData.map((post) => {
							if (post._id === id) {
								post.likes = [
									...post.likes,
									{
										user: currentUser
									}
								];
								setPost(post);
							}
							return post;
						});
					}

					localStorage.setItem(`feedPage${index}`, JSON.stringify(cachedData));
					break;
				} else {
					index++;
				}
			} else {
				break;
			}
		} while (true);
	};

	const handleLike = (id: string) => {
		const token: string | null = JSON.parse(
			localStorage.getItem("token") as string
		);
		axios
			.post(`/api/feed/like/${id}`, null, {
				headers: {
					"x-auth-token": `${token}`
				}
			})
			.then((res) => {
				const {like} = res.data;
				setLiked(like);
				likeCleanup(id, like);
			})
			.catch((err) => console.log(err));
	};

	const handleMenu = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	let date = new Date(feedPost.date);
	let monthsOffset = moment().diff(date, "months");
	let hoursOffset = moment().diff(date, "hours");
	let daysOffset = moment().diff(date, "days");
	let minutesOffset = moment().diff(date, "minutes");

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
									transitionDuration={{
										enter: 0,
										exit: 0
									}}
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
							: minutesOffset > 1
							? `Posted ${minutesOffset} minutes ago`
							: minutesOffset
							? `Posted a minute ago`
							: `Posted just now`
					}
				/>
				<CardContent>
					<Typography variant="body2" component="p" dir="auto">
						{feedPost.msg}
					</Typography>
				</CardContent>
				{feedPost.photo ? (
					<CardMedia className={classes.media}>
						<PhotoPreview
							photo={feedPost.photo}
							alt={feedPost.user.username}
							maxHeight={250}
							{...props}
						/>
					</CardMedia>
				) : (
					""
				)}
				<Likes
					liked={liked}
					users={post && post.likes.map((like) => like.user)}
					currentUser={currentUser}
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
};

export default memo(PostMedia);
