const db = require("../models");
const Post = db.posts;
const Like = db.likePost;
const DisLike = db.disLikePost;
const fs = require("fs");

// CREATION DU POST
/*
exports.createPost = (req, res, next) => {
  const thingPost = JSON.parse(req.body)
  const post = new Post( {
    ...thingPost,
    userId: req.token,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  post.create()
  .then(() => { res.status(201).json({message: 'post enregistrer!'})})
  .catch(error => { res.status(400).json( { error})})
};*/

exports.createPost = (req, res, next) => {
  //const objetPost = JSON.parse(req.body.post);

  Post.create({
    userId: req.body.userId,
    content: req.body.content,
    title: req.body.title,
    image: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  })

    .then((post) => res.status(201).json(post))
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
};

// RECUPERE TOUT LES POST D'UN USER
exports.findAllPostUser = (req, res, next) => {
  Post.findAll({
    include: ["user"],
    where: { userId: req.params.userId },
  })
    .then((post) => res.status(200).json(post))
    .catch((error) => res.status(500).json(error));
};
// RECUPERE TOUT LES POSTS
exports.getAllPosts = (req, res, next) => {
  return Post.findAll({
    include: ["user"],
  })
    .then((posts) => {
      return res.status(200).json(posts);
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
};
// MODIFICATION DU POST
exports.updatePost = (req, res, next) => {
  Post.findOne({ where: { id: req.params.id } }).then((post) => {
    const postUserId = post.userId;
    if (req.token === postUserId || req.admin === true) {
      const id = req.params.id;
      Post.update(req.body, {
        where: { id: id },
      })
        .then((num) => {
          if (num == 1) {
            res.send({
              message: "Post mis a jour ",
            });
          } else {
            res.send({
              message: "impossible de mettre a jour le post il n'existe pas",
            });
          }
        })

        .catch((err) => {
          res.status(500).send({
            message: "errror",
          });
        });
    } else {
      res.status(400).json({ error: "Vous n'avez pas la permission " });
    }
  });
};

// SUPPRESSION DU POST

exports.deletePost = (req, res, next) => {
  Post.findOne({ where: { id: req.params.id } }).then((post) => {
    const postUserId = post.userId;
    if (req.token === postUserId || req.admin === true) {
      const filename = post.image.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Post.destroy({ where: { id: req.params.id } })
          .then(() =>
            res
              .status(200)
              .json({ message: "Le post a etait supprimé avec l'image !" })
          )
          .catch((error) => res.status(400).json({ error }));
      });
    } else {
      res.status(400).json({ error: "Vous n'avait pas la permission" });
    }
  });
};

//GESTION DES LIKES

exports.getLikePost = (req, res) => {
  Like.findAll({ where: { postId: req.params.id } })
    .then((like) => res.status(200).json(like))
    .catch((error) => res.status(500).json(error));
};

exports.likePost = (req, res, next) => {
  Like.findOne({ where: { postId: req.params.id, userId: req.token } })
    .then((like) => {
      if (!like) {
        Like.create({
          postId: req.body.postId,
          userId: req.body.userId,
        })
          .then((like) => res.status(200).json(like))
          .catch((error) => {
            console.log(error);
            res.status(502).json(error);
          });
      } else {
        Like.destroy({ where: { userId: req.token } })
          .then(() => res.status(200).json({ message: "like supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((err) => {
      res.status(504).json(err);
    });
};

//Gestion des dislike

exports.disLikePost = (req, res) => {
  DisLike.findOne({ where: { postId: req.params.id, userId: req.token } })
    .then((dislike) => {
      if (!dislike) {
        DisLike.create({
          postId: req.body.postId,
          userId: req.body.userId,
        })
          .then((dislike) => res.status(200).json(dislike))
          .catch((error) => {
            console.log(error);
            res.status(502).json(error);
          });
      } else {
        DisLike.destroy({ where: { userId: req.token } })
          .then(() => res.status(200).json({ message: "dislike supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((err) => {
      res.status(504).json(err);
    });
};

exports.getDisLikePost = (req, res) => {
  DisLike.findAll({ where: { postId: req.params.id } })
    .then((dislike) => res.status(200).json(dislike))
    .catch((error) => res.status(500).json(error));
};
