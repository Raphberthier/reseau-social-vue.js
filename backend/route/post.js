const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const postCtrl = require("../controllers/post");

router.get("/", auth, postCtrl.getAllPosts);

router.post("/post", auth, multer, postCtrl.createPost);

router.get("/:userId", auth, postCtrl.findAllPostUser);

router.delete("/:id", auth, postCtrl.deletePost);

router.put("/:id", auth, postCtrl.updatePost);

//Gestion like
router.post("/like/:id", auth, postCtrl.likePost);
router.get("/like/:id", auth, postCtrl.getLikePost);

//Gestion des disLike
router.post("/dislike/:id", auth, postCtrl.disLikePost);
router.get("/dislike/:id", auth, postCtrl.getDisLikePost);
module.exports = router;
