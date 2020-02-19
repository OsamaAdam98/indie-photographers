import {LinearProgress, makeStyles} from "@material-ui/core";
import axios from "axios";
import React, {lazy, Suspense, useCallback, useEffect, useRef, useState} from "react";
import {useHistory, useLocation} from "react-router-dom";
import {DispatchContext} from "../context/AppContext";
import "../css/feed.css";

const PostMedia = lazy(() => import("../components/PostMedia"));
const PostModal = lazy(() => import("../components/modals/PostModal"));
const PostSkeleton = lazy(() => import("../components/skeletons/PostSkeleton"));
const DoneAllIcon = lazy(() => import("@material-ui/icons/DoneAll"));

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

	const appDispatch = useCallback(React.useContext(DispatchContext).dispatch, []);

	const [posts, setPosts] = useState<Post[]>([]);
	const [newPost, setNewPost] = useState<Post[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [page, setPage] = useState<number>(1);
	const [hasMore, setHasMore] = useState<boolean>(true);
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

	const handleDelete = useCallback(
		(id: string) => {
			const token: string | null = localStorage.getItem("token");

			axios
				.delete(`/api/feed/delete/${id}`, {
					headers: {
						"x-auth-token": `${token}`
					}
				})
				.then((res) => {
					cleanupDelete(id);
					appDispatch({type: "showSnackAlert", errorMsg: res.data, severity: "success"});
				})
				.catch((err) => console.log(err.response.data));
		},
		[appDispatch]
	);

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
					appDispatch({type: "hideSnackAlert"});
					setOffline(false);
					setIsLoading(false);
				})
				.catch((err) => {
					if (err && page !== 1) {
						appDispatch({type: "showSnackAlert", errorMsg: "Can't connect to the internet!", severity: "warning"});
						setOffline(true);
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
	}, [page, hasMore, appDispatch]);

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
					<PostMedia feedPost={feedPost} handleDelete={handleDelete} />
					{hasMore && <PostSkeleton />}
				</div>
			);
		} else {
			return (
				<div key={feedPost._id}>
					<PostMedia feedPost={feedPost} handleDelete={handleDelete} />
				</div>
			);
		}
	});

	const newPosts = newPost.map((incoming) => (
		<PostMedia feedPost={incoming} handleDelete={handleDelete} key={incoming._id} />
	));

	return (
		<div className="feed-container">
			<div className="feed-post-block">
				<Suspense fallback={<div />}>
					{newPosts}
					{postMedia}
				</Suspense>
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

export default React.memo(Feed);
