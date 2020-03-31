import { AppState } from "../context/AppContext";

export interface actions extends Partial<AppState> {
  type:
    | "showSnackAlert"
    | "hideSnackAlert"
    | "clearPWA"
    | "setPWA"
    | "setUser"
    | "clearUser"
    | "toggleTheme";
}

const showSnackAlert = (
  state: AppState,
  errorMsg: string,
  severity: Severity
) => {
  const updatedState = state;
  return {
    ...updatedState,
    errorMsg,
    severity,
    openError: true
  };
};

const clearUser = (state: AppState) => {
  const updatedState = state;
  localStorage.removeItem("token");
  localStorage.removeItem("userInfo");
  return {
    ...updatedState,
    user: { _id: "", email: "", admin: false, username: "" },
    isLogged: false
  };
};

const setUser = (state: AppState, user: User) => {
  const updatedState = state;
  localStorage.setItem(`userInfo`, JSON.stringify(user));
  return {
    ...updatedState,
    user,
    isLogged: true
  };
};

const toggleTheme = (state: AppState) => {
  const updatedState = state;
  localStorage.setItem("theme", JSON.stringify(!state.isLight));
  return { ...updatedState, isLight: !state.isLight };
};

const reducer = (state: AppState, action: actions): AppState => {
  switch (action.type) {
    case "showSnackAlert":
      return showSnackAlert(state, action.errorMsg!, action.severity);
    case "hideSnackAlert":
      return { ...state, openError: false };
    case "clearPWA":
      return { ...state, pwa: null, showBtn: false };
    case "setPWA":
      return { ...state, pwa: action.pwa, showBtn: true };
    case "setUser":
      return setUser(state, action.user as User);
    case "clearUser":
      return clearUser(state);
    case "toggleTheme":
      return toggleTheme(state);
    default:
      return state;
  }
};

export default reducer;
