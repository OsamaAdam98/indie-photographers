import React from "react";
import {useHistory} from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";

export default function ProfileAvatar(props) {
	const {user, setIsLogged} = props;
	const history = useHistory();
	return (
		<>
			{user ? (
				<Dropdown drop="bottom">
					<Dropdown.Toggle variant="btn">
						<img
							src={user.profilePicture}
							alt="profile"
							style={{width: "2rem", height: "2rem", borderRadius: "50%"}}
						/>
					</Dropdown.Toggle>
					<Dropdown.Menu>
						<Dropdown.Header>
							<h6>Profile</h6>
						</Dropdown.Header>
						<Dropdown.Item onClick={() => history.push("/profile")}>
							<img
								src={user.profilePicture}
								alt="profile"
								style={{width: "10rem", height: "10rem", borderRadius: "50%"}}
							/>
						</Dropdown.Item>
						<Dropdown.Divider />
						<Dropdown.Item
							onClick={() => {
								setIsLogged(false);
								history.push("/");
							}}
							bsPrefix="dropdown justify-content-center"
						>
							<button className="dropdown-item">Logout</button>
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			) : null}
		</>
	);
}
