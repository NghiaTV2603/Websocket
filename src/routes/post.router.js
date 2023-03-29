const express = require('express');
const router = express.Router();
const authenController = require("../controllers/auth.controller")
const postController = require("../controllers/post.controller")

router.post("/",authenController.checkToken,postController.upPost);
router.delete("/delete/:id",authenController.checkToken,postController.deletePost);
router.post("/:id/like",authenController.checkToken,postController.likePost);
router.post("/:id/comment",authenController.checkToken,postController.addComment);
router.get("/:id/listComment",authenController.checkToken,postController.listComment);
router.delete("/comment/:id",authenController.checkToken,postController.deleteComment);
router.get("/listAll",authenController.checkToken,postController.listAllPost);
router.get("/myPost",authenController.checkToken,postController.listMyPost);


module.exports = router;