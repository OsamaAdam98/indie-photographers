import { Switch } from "@material-ui/core";
import React from "react";
import UserContext, { DispatchContext } from "../../context/AppContext";

const LightSwitch: React.FC = () => {
  const { dispatch } = React.useContext(DispatchContext);
  const { isLight } = React.useContext(UserContext);

  const onChange = (event: any) => {
    dispatch({ type: "toggleTheme" });
  };

  return (
    <div>
      <Switch checked={isLight} color="primary" onChange={onChange} />
    </div>
  );
};

export default LightSwitch;
