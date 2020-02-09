import React, {useState, useEffect} from "react";
import axios from "axios";
import ItemCard from "../components/ItemCard";
import Loadingpage from "../components/Loadingpage";
import MPPost from "../components/modals/MPPost.modal";

interface Props {
	isLogged: boolean;
	user: User;
}

const Marketplace: React.FC<Props> = (props) => {
	const {isLogged, user} = props;

	const [items, setItems] = useState<[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		setIsLoading(true);
		axios
			.get(`/api/items`)
			.then((res) => {
				setItems(res.data);
				setIsLoading(false);
			})
			.catch((err) => console.log(`Error: ${err}`));
	}, []);

	const itemCard = items.map((item, i) => <ItemCard item={item} key={i} />);
	if (isLoading) return <Loadingpage />;
	return (
		<div className="container">
			<div className="row">
				{itemCard}
				<MPPost isLogged={isLogged} user={user} />
			</div>
		</div>
	);
};

export default Marketplace;
