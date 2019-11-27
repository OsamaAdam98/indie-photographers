import React from "react";

export default function ItemCard(props) {
	return (
		<div className="col-md-auto mb-3">
			<div
				className="card"
				style={{height: "400px", maxWidth: "400px", overflow: "hidden"}}
			>
				<img
					src={props.item.img}
					className="card-img-top img-thumbnail img-fluid"
					style={{height: "60%"}}
					alt="illustration"
				/>
				<div className="card-body">
					<h5 className="card-title">{props.item.title}</h5>
					<h6 className="card-subtitle mb-2 text-muted">
						By: {props.item.name}
					</h6>
					<p className="card-text">{props.item.desc}</p>
				</div>
			</div>
		</div>
	);
}
