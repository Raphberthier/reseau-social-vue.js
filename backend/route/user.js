const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const userCtrl = require("../controllers/user");
const multer = require("../middleware/multer-config");

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.get("/:id", auth, userCtrl.getOneUser);
router.get("/", auth, userCtrl.getAllUsers);
router.put("/:id", auth, multer, userCtrl.updateUser);
router.delete("/:id", auth, userCtrl.deleteUser);
//userOnline
router.post("/userOnline/:id", auth, userCtrl.userOn);
router.delete("/userOnline/:id", auth, userCtrl.userOff);
router.get("/userOnline/:id", userCtrl.getAllUserOn);

module.exports = router;
