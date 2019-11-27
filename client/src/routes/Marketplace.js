import React, {useState, useEffect} from "react";
import axios from "axios";
import ItemCard from "../components/ItemCard";

export default function Marketplace() {
	const [items, setItems] = useState([]);

	useEffect(() => {
		axios
			.get(`/api/items`)
			.then((res) => setItems(res.data))
			.catch((err) => console.log(`Error: ${err}`));
	});

	const itemCard = items.map((item, i) => <ItemCard item={item} key={i} />);
	return (
		<div className="container-fluid">
			<div className="row justify-content-center">{itemCard}</div>
		</div>
	);
}
