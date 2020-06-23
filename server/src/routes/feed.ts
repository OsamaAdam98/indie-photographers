import { Router } from "express";
import moment from "moment";
import auth from "../middleware/auth.middleware";
import Comment from "../models/comments.model";
import Feed from "../models/feed.model";
import Likes from "../models/likes.model";

const router = Router();

router.get("/", (req, res) => {
  const page = Number(req.query.page);

  Feed.find()
    .sort({ date: "desc" })
    .limit(10)
    .skip(page >= 1 ? 10 * (page - 1) : 0)
    .select("-photoId")
    .populate(
      "user comments likes",
      "-password -registerDate -__v -posts -email"
    )
    .populate({
      path: "likes",
      populate: {
        path: "user",
        model: "users",
      },
    })
    .exec()
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(500).json(err));
});

router.post("/add", auth, async (req: any, res: any) => {
  const user: string = req.body.user.id;
  const admin: boolean = req.body.user.admin;
  const { msg }: { msg: string } = req.body.data;
  const { photo }: { photo: string } = req.body;

  try {
    const result = await Feed.findOne({ user })
      .sort({ date: "desc" })
      .skip(1)
      .exec();
    let date: Date;
    if (result) date = new Date(result.date);

    if (date ? moment().diff(date, "minutes") > 15 : true || admin) {
      if (photo) {
        const newPost = new Feed({
          msg,
          photo,
          user,
        });

        newPost
          .save()
          .then(() => {
            Feed.findById(newPost._id)
              .populate(
                "user comments likes",
                "-password -registerDate -__v -posts"
              )
              .exec()
              .then((result) => res.status(201).json(result))
              .catch((err) => res.status(404).json(err));
          })
          .catch((err) => {
            res.status(400).json(err);
            console.log(err);
          });
      } else {
        const newPost = new Feed({
          msg,
          user,
        });

        newPost
          .save()
          .then(() => {
            Feed.findById(newPost._id)
              .populate(
                "user comments likes",
                "-password -registerDate -__v -posts"
              )
              .exec()
              .then((result) => res.status(201).json(result))
              .catch((err) => res.status(404).json(err));
          })
          .catch((err) => {
            res.status(400).json(err);
            console.log(err);
          });
      }
    } else {
      res
        .status(403)
        .json("Can't post more than 2 posts in a 15 minutes span!");
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/comment/:id", auth, (req, res) => {
  const msg: string = req.body.msg;
  const photo: string = req.body.photo;
  const user: string = req.body.user.id;
  const post: string = req.params.id;

  const newComment = new Comment({
    msg,
    photo,
    user,
    post,
  });

  newComment
    .save()
    .then(() => {
      Feed.findByIdAndUpdate(
        post,
        { $push: { comments: newComment._id } },
        (err) => {
          if (err) throw err;
        }
      );
      res.status(200).json("Comment submitted");
    })
    .catch((err) => res.status(500).json(err));
});

router.post("/like/:id", auth, (req, res) => {
  const id: string = req.params.id;
  const user: string = req.body.user.id;
  const customID: string = `${user}${id}`;

  const like = new Likes({
    user,
    post: id,
    customID,
  });

  like
    .save()
    .then(() => {
      Feed.findById(id)
        .exec()
        .then((post) => {
          const postLike = post.likes.filter((likeIterator) => {
            likeIterator === like._id;
          });
          if (postLike.length === 0) {
            Feed.findByIdAndUpdate(
              post._id,
              { $push: { likes: like._id } },
              (err) => {
                if (err) throw err;
                res.status(200).json({ like: true });
              }
            );
          }
        })
        .catch((err) => res.status(400).json(err));
    })
    .catch((err) => {
      if (err) {
        Likes.find({ customID })
          .exec()
          .then((like) => {
            Feed.findById(like[0].post)
              .exec()
              .then((post) => {
                Feed.findByIdAndUpdate(
                  post._id,
                  { $pull: { likes: like[0]._id } },
                  { upsert: true },
                  (err) => {
                    if (err) throw err;
                    Likes.findByIdAndDelete(like[0]._id)
                      .exec()
                      .then(() => res.status(200).json({ like: false }))
                      .catch(() => res.status(404).json("like not found"));
                  }
                );
              });
          })
          .catch((err) => res.status(400).json(err));
      }
    });
});

router.get("/likes/:postID", (req, res) => {
  const postID: string = req.params.postID;
  Likes.find({ post: postID })
    .populate("user", "-password")
    .sort({ date: "asc" })
    .exec()
    .then((likes) => {
      res.status(200).json(likes);
    })
    .catch(() => res.status(404).json("Post not found"));
});

router.delete("/delete/:id", auth, (req, res) => {
  Feed.findById(req.params.id)
    .exec()
    .then((post) => {
      Feed.findByIdAndDelete(post._id)
        .then(() => {
          res.status(200).json(`Post deleted!`);
        })
        .catch(() => res.status(404).json("Post not found without picture"));
    })
    .catch(() => res.status(404).json("Post not found global"));
});

router.get("/user/:id/", (req, res) => {
  const page = Number(req.query.page);

  Feed.find({ user: req.params.id })
    .sort({ date: "desc" })
    .limit(10)
    .skip(page >= 1 ? 10 * (page - 1) : 0)
    .populate(
      "user comments likes",
      "-password -registerDate -__v -posts -email"
    )
    .populate({
      path: "likes",
      populate: {
        path: "user",
        model: "users",
      },
    })
    .exec()
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(404).json(err));
});

export default router;
