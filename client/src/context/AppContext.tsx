import { createContext, Dispatch } from "react";
import { actions } from "../reducers/appReducer";

export interface AppState extends UserState {
  openError: boolean;
  errorMsg: string;
  severity: Severity;
  pwa: any;
  showBtn: boolean;
  isLight: boolean;
}

export interface SubActions {
  type: "setUser" | "clearUser";
}

export interface UserState {
  isLogged: boolean;
  user: User;
  isLight: boolean;
}

export default createContext<UserState>({
  isLogged: localStorage.getItem("token") ? true : false,
  user: JSON.parse(localStorage.getItem("userInfo") as string)
    ? JSON.parse(localStorage.getItem("userInfo") as string)
    : { admin: false },
  isLight: (JSON.parse(localStorage.getItem("theme") as string) as boolean)
    ? true
    : false
});

export const DispatchContext = createContext({
  dispatch: function() {} as Dispatch<actions>
});
