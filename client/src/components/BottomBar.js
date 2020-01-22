import React, {useState, useEffect} from "react";
import {useHistory, withRouter} from "react-router-dom";
import {BottomNavigation, BottomNavigationAction} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import ViewDayIcon from "@material-ui/icons/ViewDay";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import GetAppIcon from "@material-ui/icons/GetApp";

function BottomBar(props) {
	const {user, showBtn, handleClick} = props;
	const [value, setValue] = useState("");

	useEffect(() => {
		switch (props.location.pathname) {
			case "/feed/":
				setValue("/feed/");
				break;
			case `/profile/${user._id}`:
				setValue(`/profile/${user._id}`);
				break;
			case "/":
				setValue("/");
				break;
			default:
				setValue("");
				break;
		}
	}, [props.location.pathname, user._id]);

	const history = useHistory();

	const handleChange = (event, val) => {
		setValue(val);
		if (val === "install") {
			handleClick();
		} else {
			history.push(val);
		}
	};

	return (
		<div
			style={{
				position: "fixed",
				width: "100%",
				height: 50,
				bottom: 0
			}}
		>
			<BottomNavigation value={value} onChange={handleChange}>
				<BottomNavigationAction value="/" icon={<HomeIcon />} />
				<BottomNavigationAction value="/feed/" icon={<ViewDayIcon />} />
				<BottomNavigationAction
					value={`/profile/${user._id}`}
					icon={<AccountCircleIcon />}
					style={{
						display: localStorage.getItem("token") ? "" : "none"
					}}
				/>
				<BottomNavigationAction
					value="install"
					icon={<GetAppIcon />}
					style={{
						display: showBtn ? "" : "none"
					}}
				/>
			</BottomNavigation>
		</div>
	);
}

export default withRouter(BottomBar);
