import {LinearProgress, makeStyles} from "@material-ui/core";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import axios from "axios";
import React, {lazy, Suspense, useCallback, useEffect, useRef, useState} from "react";
import {useHistory, useLocation} from "react-router-dom";
import {PostModal, PostSkeleton, SnackAlert} from "../components";
import "../css/feed.css";

const PostMedia = lazy(() => import("../components/PostMedia"));

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

interface Props {
	isLogged: boolean;
	user: User;
}

const Feed: React.FC<Props> = ({isLogged, user}) => {
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
	const [photo, setPhoto] = useState<string>("");
	const [realPhoto, setRealPhoto] = useState<Blob | undefined>();
	const [isUploading, setIsUploading] = useState<boolean>(false);
	const [offline, setOffline] = useState<boolean>(false);
	const [lastElement, setLastElement] = useState<HTMLDivElement | null>(null);

	const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files as FileList;
		const formData = new FormData();
		formData.append("image", files[0]);

		setPhoto(URL.createObjectURL(files[0]));
		setRealPhoto(files[0]);
	};

	const handleCancel = () => {
		setPhoto("");
		if (location.hash === "#feed-post") history.goBack();
	};

	const cleanupDelete = (id: string) => {
		let index: number = 1;
		let targetHit: boolean;
		let cachedData: Post[];
		do {
			cachedData = JSON.parse(localStorage.getItem(`feedPage${index}`) as string);
			if (cachedData) {
				targetHit = cachedData.filter((data) => data._id === id).length ? true : false;
				if (targetHit) {
					setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
					setNewPost((prevPosts) => prevPosts.filter((post) => post._id !== id));
					for (let i = 1; i <= index; i++) {
						localStorage.removeItem(`feedPage${i}`);
					}
					// localStorage.setItem(`feedPage${index}`, JSON.stringify(cachedData.filter((data) => data._id !== id)));
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
			.catch((err) => console.log(err.response.data));
	}, []);

	const getNewPosts = (newPosts: Post[], cachedData: Post[]) => {
		if (newPosts && cachedData) {
			return newPosts.filter((newPost) => newPost.date > cachedData[0].date);
		} else {
			return [];
		}
	};

	useEffect(() => {
		if (hasMore) {
			let cachedData: Post[] = JSON.parse(localStorage.getItem(`feedPage${page}`) as string);
			axios
				.get(`/api/feed/?page=${page}`)
				.then((res) => {
					const {data} = res;
					let newData: Post[] = getNewPosts(data, cachedData);

					if (newData.length) {
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
					}
					setIsLoading(false);
				});
			if (cachedData) {
				setPosts((prevPosts) => [...prevPosts, ...cachedData]);
				setIsLoading(false);
				setHasMore(cachedData.length === 10);
			} else {
				setIsLoading(true);
			}
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
					<PostMedia feedPost={feedPost} currentUser={user} handleDelete={handleDelete} />
					{hasMore && <PostSkeleton />}
				</div>
			);
		} else {
			return (
				<div key={feedPost._id}>
					<PostMedia feedPost={feedPost} currentUser={user} handleDelete={handleDelete} />
				</div>
			);
		}
	});

	const newPosts = newPost.map((incoming) => (
		<PostMedia feedPost={incoming} currentUser={user} handleDelete={handleDelete} key={incoming._id} />
	));

	return (
		<div className="feed-container">
			<div className="feed-post-block">
				<Suspense fallback={<PostSkeleton />}>
					{newPosts}
					{postMedia}
				</Suspense>
				{!hasMore && !isLoading ? (
					<DoneAllIcon
						style={{
							position: "relative",
							width: "100%",
							textAlign: "center"
						}}
					/>
				) : null}
				<SnackAlert severity={severity} openError={openError} setOpenError={setOpenError} errorMsg={errorMsg} />
				<PostModal
					isLogged={isLogged}
					user={user}
					setNewPost={setNewPost}
					photo={photo}
					setPhoto={setPhoto}
					isUploading={isUploading}
					onUpload={onUpload}
					offline={offline}
					handleCancel={handleCancel}
					realPhoto={realPhoto}
					setIsUploading={setIsUploading}
				/>
			</div>

			{isUploading && <LinearProgress color="primary" className={classes.progress} />}
		</div>
	);
};

export default Feed;
