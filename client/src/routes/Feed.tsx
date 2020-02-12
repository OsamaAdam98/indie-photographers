import {LinearProgress, makeStyles} from "@material-ui/core";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import axios from "axios";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {RouteComponentProps, useHistory, useLocation} from "react-router-dom";
import {PostMedia, PostModal, PostSkeleton, SnackAlert} from "../components";
import "../css/feed.css";

const useStyles = makeStyles({
	progress: {
		position: "fixed",
		left: 0,
		bottom: 0,
		width: "100vw",
		height: 4
	},
	"@media (max-width: 31.25rem)": {
		progress: {
			position: "fixed",
			bottom: 48,
			height: 4
		}
	}
});

interface Props extends RouteComponentProps<MatchParams> {
	isLogged: boolean;
	user: User;
}

const Feed: React.FC<Props> = (props) => {
	const {isLogged, user} = props;
	const classes = useStyles();
	const history = useHistory();
	const location = useLocation();

	const [posts, setPosts] = useState<Post[]>([]);
	const [newPost, setNewPost] = useState<Post[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [page, setPage] = useState<number>(1);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const [errorMsg, setErrorMsg] = useState<string>("");
	const [openError, setOpenError] = useState<boolean>(false);
	const [severity, setSeverity] = useState<Severity>(undefined);
	const [photo, setPhoto] = useState<Photo>({eager: [{secure_url: ""}]});
	const [isUploading, setIsUploading] = useState<boolean>(false);
	const [offline, setOffline] = useState<boolean>(false);
	const [lastElement, setLastElement] = useState<HTMLDivElement | null>(null);

	const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files as FileList;
		const formData = new FormData();
		formData.append("image", files[0]);

		setErrorMsg(
			"Uploading photo, we'll notify you when the upload is complete."
		);
		setSeverity("info");
		setOpenError(true);
		setIsUploading(true);

		axios
			.post("/api/feed/upload", formData)
			.then((res) => {
				setIsUploading(false);
				const {data} = res;
				setPhoto(data);
				setErrorMsg("Upload complete!");
				setSeverity("success");
				setOpenError(true);
			})
			.catch((err) => {
				if (err) {
					setErrorMsg("Upload failed!");
					setSeverity("error");
					setOpenError(true);
					setIsUploading(false);
				}
			});
	};

	const handleCancel = () => {
		if (photo.eager[0].secure_url.trim()) {
			axios
				.delete(`/api/feed/delete-photo/${photo.public_id}`)
				.then((res) => {
					console.log(res.data);
				})
				.catch((err) => console.log(err));
		}
		setPhoto({eager: [{secure_url: ""}]});
		if (location.hash === "#feed-post") history.goBack();
	};

	const cleanupDelete = (id: string) => {
		let index: number = 1;
		let targetHit: boolean;
		let cachedData: Post[];
		do {
			cachedData = JSON.parse(
				localStorage.getItem(`feedPage${index}`) as string
			);
			if (cachedData) {
				targetHit = cachedData.filter((data) => data._id === id).length
					? true
					: false;
				if (targetHit) {
					setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
					setNewPost((prevPosts) =>
						prevPosts.filter((post) => post._id !== id)
					);

					localStorage.setItem(
						`feedPage${index}`,
						JSON.stringify(cachedData.filter((data) => data._id !== id))
					);
					break;
				}
				index++;
			} else break;
		} while (true);
	};

	const handleDelete = useCallback((id: string) => {
		const token: string | null = localStorage.getItem("token");

		axios
			.delete(`/api/feed/delete/${id}`, {
				headers: {
					"x-auth-token": `${token}`
				}
			})
			.then((res) => {
				cleanupDelete(id);
				setErrorMsg(res.data as string);
				setSeverity("success");
				setOpenError(true);
			})
			.catch((err) => console.log(err));
	}, []);

	const getNewPosts = (newPosts: Post[], cachedData: Post[]) => {
		if (newPosts && cachedData) {
			return newPosts.filter((newPost) => newPost.date > cachedData[0].date);
		} else {
			return [];
		}
	};

	useEffect(() => {
		setIsLoading(true);
		if (hasMore) {
			let cachedData: Post[] = JSON.parse(
				localStorage.getItem(`feedPage${page}`) as string
			);
			if (cachedData) {
				setPosts((prevPosts) => [...prevPosts, ...cachedData]);
				setIsLoading(false);
				setHasMore(cachedData.length === 10);
			}

			axios
				.get(`/api/feed/?page=${page}`)
				.then((res) => {
					const {data} = res;
					let newData: Post[] = getNewPosts(data, cachedData);

					if (newData) {
						setNewPost((prevPosts) => [...prevPosts, ...newData]);
					}

					if (!cachedData) {
						setPosts((prevPosts) => [...prevPosts, ...data]);
					}

					setHasMore(data.length === 10);
					localStorage.setItem(`feedPage${page}`, JSON.stringify(data));
					setErrorMsg("");
					setOpenError(false);
					setOffline(false);
					setIsLoading(false);
				})
				.catch((err) => {
					if (err && page !== 1) {
						setErrorMsg("Can't connect to the internet!");
						setSeverity("warning");
						setOffline(true);
						setOpenError(true);
						if (cachedData) setHasMore(cachedData.length === 10);
					}
					setIsLoading(false);
				});
		} else {
			setIsLoading(false);
		}
	}, [page, hasMore]);

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

	const postMedia = posts.map((feedPost, i) => {
		if (posts.length === i + 1) {
			return (
				<div ref={setLastElement} key={feedPost._id}>
					<PostMedia
						{...props}
						feedPost={feedPost}
						currentUser={user}
						handleDelete={handleDelete}
					/>
					{hasMore && <PostSkeleton />}
				</div>
			);
		} else {
			return (
				<div key={feedPost._id}>
					<PostMedia
						{...props}
						feedPost={feedPost}
						currentUser={user}
						handleDelete={handleDelete}
					/>
				</div>
			);
		}
	});

	const newPosts = newPost
		? newPost.map((incoming) => (
				<PostMedia
					{...props}
					feedPost={incoming}
					currentUser={user}
					handleDelete={handleDelete}
					key={incoming._id}
				/>
		  ))
		: null;

	return (
		<div className="feed-container">
			<div className="feed-post-block">
				{newPost && newPosts}
				{postMedia}
				{!hasMore && !isLoading ? (
					<DoneAllIcon
						style={{
							position: "relative",
							width: "100%",
							textAlign: "center"
						}}
					/>
				) : null}
				<SnackAlert
					severity={severity}
					openError={openError}
					setOpenError={setOpenError}
					errorMsg={errorMsg}
				/>
				<PostModal
					{...props}
					isLogged={isLogged}
					user={user}
					setNewPost={setNewPost}
					photo={photo}
					setPhoto={setPhoto}
					isUploading={isUploading}
					onUpload={onUpload}
					offline={offline}
					handleCancel={handleCancel}
				/>
			</div>

			{isUploading && (
				<LinearProgress color="primary" className={classes.progress} />
			)}
		</div>
	);
};

export default Feed;
