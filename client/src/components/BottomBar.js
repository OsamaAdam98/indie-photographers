import React, {useState, useEffect} from "react";
import {useHistory, withRouter} from "react-router-dom";
import {
	// BottomNavigation,
	// BottomNavigationAction,
	Avatar,
	Tab,
	Tabs,
	Paper,
	makeStyles
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import ViewDayIcon from "@material-ui/icons/ViewDay";
import GetAppIcon from "@material-ui/icons/GetApp";

const useStyles = makeStyles((theme) => ({
	tabs: {
		backgroundColor: theme.palette.background.paper,
		position: "fixed",
		bottom: 0,
		width: "100%",
		boxShadow: "0px -1px 5px 1px rgba(0, 0, 0, .3)"
	}
}));

function BottomBar(props) {
	const {user, showBtn, handleClick} = props;
	const [value, setValue] = useState(false);

	const classes = useStyles();

	useEffect(() => {
		switch (props.location.pathname) {
			case "/feed/":
				setValue(1);
				break;
			case `/profile/${user._id}`:
				setValue(2);
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
				history.push("/feed/");
				break;
			case 2:
				history.push(`/profile/${user._id}`);
				break;
			case 3:
				handleClick();
				break;
			default:
				break;
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
			{/* <BottomNavigation
				value={value}
				onChange={handleChange}
				style={{
					boxShadow: "0px -1px 5px 1px rgba(0, 0, 0, .3)"
				}}
				color="inherit"
			>
				<BottomNavigationAction value="/" icon={<HomeIcon />} />
				<BottomNavigationAction value="/feed/" icon={<ViewDayIcon />} />
				<BottomNavigationAction
					value={`/profile/${user._id}`}
					icon={
						<Avatar
							src={user.profilePicture}
							style={{
								width: 24,
								height: 24
							}}
						/>
					}
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
			</BottomNavigation> */}
			<Paper square>
				<Tabs
					value={value}
					onChange={handleChange}
					variant="fullWidth"
					indicatorColor="primary"
					textColor="primary"
					aria-label="icon tabs example"
					className={classes.tabs}
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
						aria-label="person"
						style={{
							display: user.username ? "" : "none"
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
		</div>
	);
}

export default withRouter(BottomBar);
