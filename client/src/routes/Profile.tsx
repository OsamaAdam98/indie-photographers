import {Avatar, List, ListItem, ListItemAvatar, ListItemText, makeStyles, Paper, Typography} from "@material-ui/core";
import axios from "axios";
import React, {lazy, Suspense, useEffect, useRef, useState, useCallback} from "react";
import {useParams} from "react-router-dom";
import {PhotoPreview, PostSkeleton} from "../components/index";
import {DispatchContext} from "../context/AppContext";
import "../css/profile.css";

const PostMedia = lazy(() => import("../components/PostMedia"));
const DoneAllIcon = lazy(() => import("@material-ui/icons/DoneAll"));
const ImageIcon = lazy(() => import("@material-ui/icons/Image"));
const WorkIcon = lazy(() => import("@material-ui/icons/Work"));
const BeachAccessIcon = lazy(() => import("@material-ui/icons/BeachAccess"));

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
		maxWidth: 360,
		padding: theme.spacing(2)
	}
}));

const Profile: React.FC = () => {
	const [user, setUser] = useState<User | null>(null);
	const [posts, setPosts] = useState<Post[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [page, setPage] = useState<number>(1);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const [lastElement, setLastElement] = useState<HTMLDivElement | null>(null);

	const appDispatch = useCallback(React.useContext(DispatchContext).dispatch, []);

	const classes = useStyles();
	const params: {id?: string} = useParams();

	const handleDelete = (id: string) => {
		const token: string | null = localStorage.getItem("token");

		axios
			.delete(`/api/feed/delete/${id}`, {
				headers: {
					"x-auth-token": `${token}`
				}
			})
			.then((res) => {
				appDispatch({type: "showSnackAlert", errorMsg: res.data, severity: "success"});
			})
			.catch((err) => console.log(err));
	};

	useEffect(() => {
		if (hasMore) {
			let cachedData: Post[] = JSON.parse(localStorage.getItem(`${params.id}/page${page}`) as string);
			axios
				.get(`/api/feed/user/${params.id}/?page=${page}`)
				.then((res) => {
					const data: Post[] = res.data;

					if (!cachedData) setPosts((prevPosts) => [...prevPosts, ...data]);

					setHasMore(data.length === 10);
					localStorage.setItem(
						`${params.id}/page${page}`,
						JSON.stringify(data.filter((post) => post.user._id === params.id))
					);
					appDispatch({type: "hideSnackAlert"});
					setIsLoading(false);
				})
				.catch((err) => {
					if (err) {
						if (err) {
							appDispatch({type: "showSnackAlert", errorMsg: "User not found", severity: "error"});
						} else {
							appDispatch({
								type: "showSnackAlert",
								errorMsg: "Can't connect to the internet!",
								severity: "warning"
							});
						}
						setIsLoading(false);
					}
				});
			if (cachedData) {
				setPosts((prevPosts) => [...prevPosts, ...cachedData].filter((post) => post.user._id === params.id));
				setIsLoading(false);
				setHasMore(cachedData.length === 10);
			} else {
				setIsLoading(true);
			}
		} else setIsLoading(false);
	}, [page, params.id, hasMore, appDispatch]);

	useEffect(() => {
		if (params.id) {
			let cachedData: User = JSON.parse(localStorage.getItem(`${params.id}`) as string);
			if (cachedData) setUser(cachedData);
			axios
				.get(`/api/users/${params.id}`)
				.then((res) => {
					const data: User = res.data;
					setUser(data);
					localStorage.setItem(`${params.id}`, JSON.stringify(data));
				})
				.catch((err) => {
					if (err) {
						appDispatch({type: "showSnackAlert", errorMsg: "Can't find user", severity: "error"});
					}
				});
		}
		return () => {
			setPosts([]);
			setPage(1);
			setHasMore(true);
		};
	}, [params.id, appDispatch]);

	const observer = useRef(
		new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
			if (entries[0].isIntersecting) {
				setPage((page) => page + 1);
			}
		})
	);

	useEffect(() => {
		const currentElement = lastElement;
		const currentObserver = observer.current;

		if (currentElement) currentObserver.observe(currentElement);

		return () => {
			if (currentElement) currentObserver.unobserve(currentElement);
		};
	}, [lastElement]);

	const postMedia = posts
		? posts.map((feedPost, i) => {
				if (posts.length === i + 1) {
					return (
						<div ref={setLastElement} key={feedPost._id}>
							<PostMedia feedPost={feedPost} handleDelete={handleDelete} />
							{hasMore ? <PostSkeleton /> : null}
						</div>
					);
				} else {
					return (
						<div key={feedPost._id}>
							<PostMedia feedPost={feedPost} handleDelete={handleDelete} />
						</div>
					);
				}
		  })
		: null;

	return (
		<div className="container">
			{user ? (
				<>
					<Paper className="main-block">
						<div className="cover-photo" />
						<PhotoPreview photo={user.profilePicture} alt={user.username} round={true} />
						<div className="tagline">
							<Typography variant="h5">{user.username}</Typography>
							<Typography
								style={{
									fontStyle: "italic"
								}}
							>
								<span className="highlight">title</span>
							</Typography>
						</div>
						<div className="main-info">
							<Typography>
								Irure culpa sint tempor Lorem Lorem eu eu consequat in elit. Laborum id magna mollit pariatur.
								Incididunt velit mollit sit aliqua duis esse nisi velit esse ad occaecat voluptate aliqua esse.
								Adipisicing pariatur sint consequat ea et pariatur sint nisi anim.
							</Typography>
						</div>
					</Paper>
					<Paper className="details-block">
						<List className={classes.root}>
							<ListItem>
								<ListItemAvatar>
									<Avatar>
										<ImageIcon />
									</Avatar>
								</ListItemAvatar>
								<ListItemText primary="Placeholder" secondary="Placeholder" />
							</ListItem>
							<ListItem>
								<ListItemAvatar>
									<Avatar>
										<WorkIcon />
									</Avatar>
								</ListItemAvatar>
								<ListItemText primary="Placeholder" secondary="Placeholder" />
							</ListItem>
							<ListItem>
								<ListItemAvatar>
									<Avatar>
										<BeachAccessIcon />
									</Avatar>
								</ListItemAvatar>
								<ListItemText primary="Placeholder" secondary="Placeholder" />
							</ListItem>
						</List>
					</Paper>
				</>
			) : null}

			<div className="post-block">
				<Suspense fallback={<div />}>{postMedia}</Suspense>

				{!hasMore && !isLoading ? (
					<Suspense fallback={<div />}>
						<DoneAllIcon
							style={{
								position: "relative",
								width: "100%",
								textAlign: "center"
							}}
						/>
					</Suspense>
				) : null}
				<div className="invisibleDiv" />
			</div>
		</div>
	);
};

export default React.memo(Profile);
