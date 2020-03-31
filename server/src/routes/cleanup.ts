import { Router } from "express";
import auth from "../middleware/auth.middleware";
import Comments from "../models/comments.model";
import Feed from "../models/feed.model";
import Likes from "../models/likes.model";
import Users from "../models/users.model";

const router = Router();

router.get("/user/:id", auth, (req, res) => {
  const id = req.params.id;
  Users.findById(req.body.user.id)
    .exec()
    .then((user) => {
      if (user.admin) {
        Feed.deleteMany({ user: id })
          .exec()
          .then(() => {
            console.log("Deleted posts");
            Likes.deleteMany({ user: id })
              .exec()
              .then(() => {
                console.log("Deleted likes");
                Comments.deleteMany({ user: id })
                  .exec()
                  .then(() => {
                    console.log("Deleted comments");
                    Users.findByIdAndDelete(id)
                      .exec()
                      .then(() => {
                        console.log("Deleted user");
                        res.status(200).json("deleted");
                      })
                      .catch((err) => console.log(err));
                  })
                  .catch((err) => console.log(err));
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      } else {
        res.status(401).json("Unauthorized");
      }
    })
    .catch((err) => console.log(err));
});

export default router;
