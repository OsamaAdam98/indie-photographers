import React, {useState, useEffect, useRef, useCallback} from "react";
import axios from "axios";
import PostModal from "../components/modals/FeedPost.modal";
import PostMedia from "../components/PostMedia";
import PostSkeleton from "../components/PostSkeleton";
import {Grid, Box} from "@material-ui/core";
import DoneAllIcon from "@material-ui/icons/DoneAll";

export default function Feed(props) {
	const {isLogged, user} = props;

	const [posts, setPosts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(false);
	const [isDesktop, setIsDesktop] = useState(false);

	useEffect(() => {
		setIsDesktop(window.innerWidth > 500 ? true : false);
	}, []);

	const handleDelete = (id) => {
		const token = localStorage.getItem("token");
		axios
			.delete(`/api/feed/delete/${id}`, {
				headers: {
					"x-auth-token": `${token}`
				}
			})
			.then((res) => console.log(res))
			.then(() => (window.location = "/feed/"))
			.catch((err) => console.log(err));
	};

	useEffect(() => {
		setIsLoading(true);
		axios
			.get(`/api/feed/?page=${page}`)
			.then((res) => {
				const {data} = res;
				setPosts((prevPosts) =>
					[...prevPosts, ...data].sort((a, b) => {
						let dateA = new Date(a.date);
						let dateB = new Date(b.date);
						return dateB - dateA;
					})
				);
				setIsLoading(false);
				setHasMore(data.length > 0);
			})
			.catch((err) => console.log(err));
	}, [page]);

	const observer = useRef();

	const lastElementRef = useCallback(
		(node) => {
			if (isLoading) return;
			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					setPage((prevPage) => prevPage + 1);
				}
			});
			if (node) observer.current.observe(node);
		},
		[isLoading, hasMore]
	);

	const postMedia = posts.map((feedPost, i) => {
		if (posts.length === i + 1) {
			return (
				<div ref={lastElementRef} key={feedPost._id}>
					<PostMedia
						feedPost={feedPost}
						isLoading={isLoading}
						currentUser={user}
						handleDelete={handleDelete}
					/>
					{hasMore ? <PostSkeleton /> : null}
				</div>
			);
		} else {
			return (
				<div key={feedPost._id}>
					<PostMedia
						feedPost={feedPost}
						isLoading={isLoading}
						currentUser={user}
						handleDelete={handleDelete}
					/>
				</div>
			);
		}
	});

	return (
		<>
			<Grid container direction="column" alignItems="center" justify="center">
				{isDesktop ? (
					<Box width="500px">
						{postMedia}
						{isLoading ? <PostSkeleton /> : null}
						{!hasMore && !isLoading ? (
							<DoneAllIcon style={{marginRight: "50%", marginLeft: "50%"}} />
						) : null}
						<PostModal isLogged={isLogged} user={user} />
					</Box>
				) : (
					<Box minWidth="100%">
						{postMedia}
						{isLoading ? <PostSkeleton /> : null}
						{!hasMore && !isLoading ? (
							<DoneAllIcon style={{marginRight: "45%", marginLeft: "45%"}} />
						) : null}
						<PostModal isLogged={isLogged} user={user} />
					</Box>
				)}
			</Grid>
		</>
	);
}
