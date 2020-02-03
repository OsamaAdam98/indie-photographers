import React, {useState, useEffect} from "react";
import {useHistory, withRouter} from "react-router-dom";
import {Avatar, Tab, Tabs, Paper, makeStyles} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import ViewDayIcon from "@material-ui/icons/ViewDay";
import GetAppIcon from "@material-ui/icons/GetApp";
import SettingsIcon from "@material-ui/icons/Settings";
import {useWindowDimensions} from "./index";

const useStyles = makeStyles((theme) => ({
	tabs: {
		backgroundColor: theme.palette.background.paper,
		width: "100%",
		boxShadow: "0px -1px 5px 1px rgba(0, 0, 0, .3)"
	}
}));

function BottomBar(props) {
	const {user, showBtn, handleClick} = props;
	const [value, setValue] = useState(false);

	const classes = useStyles();
	const {width} = useWindowDimensions();

	useEffect(() => {
		switch (props.location.pathname) {
			case "/feed/":
				setValue(1);
				break;
			case `/profile/${user._id}`:
				setValue(2);
				break;
			case "/settings":
				setValue(3);
				break;
			case "/":
				setValue(0);
				break;
			default:
				setValue(false);
				break;
		}
	}, [props.location.pathname, user._id]);

	const history = useHistory();

	const handleChange = (event, val) => {
		setValue(val);

		switch (val) {
			case 0:
				history.push("/");
				break;
			case 1:
				if (props.location.pathname === "/feed/")
					window.scroll({
						top: 0,
						left: 0,
						behavior: "auto"
					});
				history.push("/feed/");
				break;
			case 2:
				if (props.location.pathname === `/profile/${user._id}`)
					window.scroll({
						top: 0,
						left: 0,
						behavior: "auto"
					});
				history.push(`/profile/${user._id}`);
				break;
			case 3:
				history.push("/settings");
				break;
			case 4:
				handleClick();
				break;
			default:
				break;
		}
	};

	return (
		<Paper square>
			<Tabs
				value={value}
				onChange={handleChange}
				variant={width < 500 ? "fullWidth" : "standard"}
				indicatorColor="primary"
				textColor="primary"
				aria-label="Bottom navigation"
				className={classes.tabs}
				centered
			>
				<Tab icon={<HomeIcon />} aria-label="Home" />

				<Tab icon={<ViewDayIcon />} aria-label="Feed" />

				<Tab
					icon={
						<Avatar
							src={user.profilePicture}
							style={{
								width: 24,
								height: 24
							}}
						/>
					}
					aria-label="Profile"
					style={{
						display: user.username ? "" : "none"
					}}
				/>

				<Tab
					icon={<SettingsIcon />}
					aria-label="Settings"
					style={{
						display: user.username ? "none" : ""
					}}
				/>

				<Tab
					icon={<GetAppIcon />}
					aria-label="Install app"
					style={{
						display: showBtn ? "" : "none"
					}}
				/>
			</Tabs>
		</Paper>
	);
}

export default withRouter(BottomBar);
