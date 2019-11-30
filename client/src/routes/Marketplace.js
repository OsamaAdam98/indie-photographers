import React, {useState, useEffect} from "react";
import axios from "axios";
import ItemCard from "../components/ItemCard";
import Loadingpage from "../components/Loadingpage";

export default function Marketplace() {
	const [items, setItems] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

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
			<div className="row">{itemCard}</div>
		</div>
	);
}
