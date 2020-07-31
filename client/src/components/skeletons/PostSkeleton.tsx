import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import { Skeleton } from "@material-ui/lab";
import React from "react";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: "31.25rem",
    marginBottom: theme.spacing(2),
    width: "100%",
  },
  media: {
    height: "15.625rem",
  },
}));
const PostSkeleton: React.FC = () => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={<Skeleton variant="circle" width={40} height={40} />}
        title={<Skeleton height={10} width="80%" style={{ marginBottom: 6 }} />}
        subheader={<Skeleton height={10} width="40%" />}
      />
      <CardContent>
        <Skeleton height={10} style={{ marginBottom: 6 }} />
        <Skeleton height={10} width="80%" />
      </CardContent>

      <Skeleton variant="rect" className={classes.media} />
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default PostSkeleton;
