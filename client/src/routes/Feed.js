import React, {useState, useEffect} from "react";
import axios from "axios";
import Loadingpage from "../components/Loadingpage";
import FeedPost from "../components/FeedPost";
import PostModal from "../components/modals/FeedPost.modal";

export default function Feed(props) {
	const {isLogged, user} = props;

	const [posts, setPosts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);

		axios
			.get(`/api/feed/`)
			.then((res) => {
				const {data} = res;
				setPosts(
					data.sort((a, b) => {
						let dateA = new Date(a.post.date);
						let dateB = new Date(b.post.date);
						return dateB - dateA;
					})
				);
				setIsLoading(false);
			})
			.catch((err) => console.log(`Error: ${err}`));
	}, []);

	const postMedia = posts.map((feedPost, i) => (
		<FeedPost feedPost={feedPost} key={i} />
	));

	if (isLoading) return <Loadingpage />;
	return (
		<div className="container">
			{postMedia}
			<PostModal isLogged={isLogged} user={user} />
		</div>
	);
}
