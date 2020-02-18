import {UserState} from "../context/AppContext";

interface Actions extends Partial<UserState> {
	type: "test";
}

const clearUser = (state: UserState) => {
	const updatedState = state;
	localStorage.removeItem("token");
	localStorage.removeItem("userInfo");
	return {...updatedState, user: {admin: false}, isLogged: false};
};

const setUser = (state: UserState, user: User, isLogged: boolean) => {
	const updatedState = state;
	localStorage.setItem(`userInfo`, JSON.stringify(user));
	return {
		...updatedState,
		user,
		isLogged
	};
};

const test = (state: UserState) => {
	console.log(state);
	return {...state, isLogged: !state.isLogged};
};

export default (state: UserState, action: Actions) => {
	switch (action.type) {
		case "test":
			return test(state);
		default:
			return state;
	}
};
