import React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import "../css/bootstrap-social.css";
import axios from "axios";

export default function FBButton(props) {
	const {setUser, handleClose, setIsLogged} = props;

	const componentClicked = () => console.log("Button clicked");

	const responseFacebook = (res) => {
		axios
			.post("/api/auth/facebook-login", res)
			.then((res) => {
				const {token, user} = res.data;
				if (token) {
					localStorage.setItem("token", token);
					setIsLogged(true);
					handleClose();
				}
				if (user) {
					setUser(user);
				}
			})
			.catch((err) => {
				console.log(err);
				if (res.picture) {
					setUser({
						username: res.name,
						email: res.email,
						profilePicture: res.picture.data.url,
						admin: false
					});
					handleClose();
				}
			});
	};

	return (
		<>
			<FacebookLogin
				appId={`608523869954489`}
				autoLoad={false}
				fields={`name,email,picture.width(800).height(800)`}
				onClick={componentClicked}
				callback={responseFacebook}
				disableMobileRedirect={true}
				render={(renderProps) => (
					<button
						type="button"
						onClick={renderProps.onClick}
						className="btn btn-block btn-social btn-facebook"
					>
						<span className="fab fa-facebook" style={{fontSize: "1rem"}}></span>
						Continue with Facebook
					</button>
				)}
			/>
		</>
	);
}
