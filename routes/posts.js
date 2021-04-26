const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const verifyToken = require('../verifyToken');

//GET ALL POSTS
router.get('/', verifyToken, async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    }
    catch (err) {
        res.json({ message: err });
    }
})

//GET SPESIFIC POST
router.get('/:postId', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        res.json(post);
    }
    catch (err) {
        res.json({ message: err });
    }
})

//SUBMIT A POST
router.post('/', verifyToken, async (req, res) => {
    const post = new Post({
        title: req.body.title,
        description: req.body.description
    });

    try {
        const savedPost = await post.save();
        res.json(savedPost);
    }
    catch (err) {
        res.json({ message: err })
    }

})

//DELETE POST
router.delete('/:postId', verifyToken, async (req, res) => {
    try {
        const removedPost = await Post.deleteOne({ _id: req.params.postId });
        res.json(removedPost);
    }
    catch (err) {
        res.json({ message: err });
    }
})

//UPDATE A POST
router.patch('/:postId', verifyToken, async (req, res) => {
    try {
        const updatedPost = await Post.updateOne({ _id: req.params.postId }, { $set: { title: req.body.title } });
        res.json(updatedPost);
    }
    catch (err) {
        res.json({ message: err });
    }
})

module.exports = router;