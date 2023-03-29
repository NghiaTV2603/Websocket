const Post = require('../models/post.model');
const User = require('../models/user.model');
const Comment = require('../models/comment.model');

const postController = {
    upPost: async (req, res, next) => {
        try {
            const { image, description } = req.body;
            const newPost = await Post.create({
                user_id: req.id,
                image: image,
                description: description,
                likes: [],
            });
            await User.updateOne(
                { _id: req.id },
                { $push: { posts: newPost._id } }
            );
            res.status(201).send(newPost);
        } catch (e) {
            res.status(400).json(e);
        }
    },
    deletePost: async (req, res) => {
        try {
            const id = req.params.id;
            console.log(id);
            const postDelete = await Post.deleteOne({ _id: id });
            await User.updateOne({ _id: req.id }, { $pull: { posts: id } });
            res.send('success');
        } catch (e) {
            res.status(500).json(e);
        }
    },
    listAllPost: async (req, res, next) => {
        try {
            var listData = await Post.find()
                .sort({ created_at: -1 })
                .populate('user_id', '-password')
                .populate('likes', '-password')
                .populate('comments')
                .sort({ createdAt: -1 });
            listData = await User.populate(listData, {
                path: 'comments.user_id',
                select: 'username avatar',
            });
            res.status(200).send(listData);
        } catch (e) {
            res.status(400).send(e);
        }
    },
    listMyPost: async (req, res) => {
        try {
            const user_id = req.id;
            const data = await Post.find({
                user_id: user_id,
            })
                .populate('user_id', '-password')
                .sort({ createdAt: -1 });
            res.status(200).send(data);
        } catch (e) {
            res.status(400).send(e);
        }
    },
    likePost: async (req, res) => {
        try {
            const post_id = req.params.id;
            const user_id = req.id;
            const post = await Post.findById(post_id);
            if (post.likes.includes(user_id)) {
                post.likes.pull(user_id);
                await post.save();
                return res.status(200).send({ message: 'unlike success' });
            }
            post.likes.push(user_id);
            await post.save();
            res.status(200).send({ message: 'like success' });
        } catch (e) {
            res.status(500).send(e);
        }
    },
    addComment: async (req, res) => {
        try {
            const post_id = req.params.id;
            const user_id = req.id;
            const { content } = req.body;
            const newComment = await Comment.create({
                user_id,
                post_id,
                content,
            });
            const commentRes = await Comment.find({ _id: newComment._id }).populate("user_id","-password");

            await Post.updateOne(
                { _id: post_id },
                { $push: { comments: newComment._id } }
            );
            res.status(201).json(commentRes);
        } catch (e) {
            res.status(500).send(e);
        }
    },
    listComment: async (req, res) => {
        try {
            const post_id = req.params.id;
            const dataComment = await Comment.find({
                post_id,
            }).populate('user_id', '-password');
            res.status(200).send(dataComment);
        } catch (e) {
            res.status(500).send(e);
        }
    },
    deleteComment: async (req, res) => {
        try {
            const id = req.params.id;
            const commentDelete = await Comment.findById(id);
            await Post.updateOne(
                { _id: commentDelete.post_id },
                { $pull: { comments: id } }
            );
            const comment = await Comment.deleteOne({ _id: id });
            res.send('success');
        } catch (e) {
            res.status(500).json(e);
        }
    },
};

module.exports = postController;
