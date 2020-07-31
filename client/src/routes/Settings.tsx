import { Button, Container, makeStyles, Typography } from "@material-ui/core";
import React, { Suspense } from "react";

const LightSwitch = React.lazy(() =>
  import("../components/buttons/LightSwitch")
);

const useStyles = makeStyles(() => ({
  btnStyle: {
    "@media all and (display-mode: standalone)": {
      display: "none",
    },
  },
}));

interface Props {
  showBtn: boolean;
  handleClick: () => void;
}

const Settings: React.FC<Props> = ({ showBtn, handleClick }) => {
  const classes = useStyles();

  return (
    <Container maxWidth="lg">
      <Typography>Light mode</Typography>
      <Suspense fallback={<div />}>
        <LightSwitch />
      </Suspense>
      <Button
        size="large"
        color="primary"
        variant="contained"
        onClick={handleClick}
        className={classes.btnStyle}
        style={{
          display: showBtn ? "" : "none",
        }}
      >
        Install
      </Button>
    </Container>
  );
};

export default React.memo(Settings);
