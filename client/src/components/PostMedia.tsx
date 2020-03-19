import {
	Avatar,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	CardMedia,
	IconButton,
	makeStyles,
	Menu,
	MenuItem,
	Typography
} from "@material-ui/core";
import axios from "axios";
import moment from "moment";
import React, { memo, useState, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import UserContext from "../context/AppContext";

const FavoriteIcon = lazy(() => import("@material-ui/icons/Favorite"));
const MoreVertIcon = lazy(() => import("@material-ui/icons/MoreVert"));
const ShareIcon = lazy(() => import("@material-ui/icons/Share"));
const PhotoPreview = lazy(() => import("./modals/PhotoPreview"));
const Likes = lazy(() => import("./modals/Likes"));

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
	feedPost: Post;
	handleDelete: (id: string) => void;
}

const PostMedia: React.FC<Props> = ({ feedPost, handleDelete }) => {
	const classes = useStyles();
	const { user } = feedPost;
	const currentUser = React.useContext(UserContext).user;

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
		const token: string | null = localStorage.getItem("token");

		axios
			.post(`/api/feed/like/${id}`, null, {
				headers: {
					"x-auth-token": `${token}`
				}
			})
			.then((res) => {
				const { like } = res.data;
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
			<Suspense fallback={<div />}>
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
							currentUser._id === user._id || currentUser.admin ? (
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
								realPhoto={feedPost.photo}
								// TODO: super hacky, remove before production!
								photo={feedPost.photo as string}
								alt={feedPost.user.username}
								maxHeight={250}
							/>
						</CardMedia>
					) : (
						""
					)}
					<Likes
						liked={liked}
						users={post?.likes.map((like) => like.user)}
						currentUser={currentUser}
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
			</Suspense>
		);
	} else {
		return null;
	}
};

export default memo(PostMedia);
