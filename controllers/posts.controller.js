const validator = require('validator')

const Post = require('../models/Post')

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).select('-__v')
        if (!posts) {
            return res.status(404).json({ message: 'Posts not found.' })
        }
        return res.status(200).json(posts)
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const getPostsByUser = async (req, res) => {
    try {
        const posts = await Post.find({ user: req.params._id })
            .sort({ createdAt: -1 })
            .select('-__v')
        if (!posts) {
            return res.status(404).json({ message: 'Posts not found.' })
        }
        return res.status(200).json(posts)
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).select('-__v')
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' })
        }
        return res.status(200).json(post)
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const createPost = async (req, res) => {
    const validation = validatePost(req.body)
    if (!validation.isValid) {
        return res.status(400).json(validation.errors)
    }
    try {
        const { title, content } = req.body
        const newPost = new Post({ title, content, user: req.user._id})
        await newPost.save()
        return res.status(201).json({ message: 'Post created!' })
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const updatePost = async (req, res) => {
    const validation = validatePost(req.body)
    if (!validation.isValid) {
        return res.status(400).json(validation.errors)
    }
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' })
        }
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this post.' })
        }
        const { title, content } = req.body
        post.set({ title, content })
        await post.save()
        return res.status(200).json({ message: 'Post updated!' })
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' })
        }
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: 'You are not authorized to delete this post.',
            })
        }
        await post.remove()
        return res.status(200).json({ message: 'Post deleted!' })
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const validatePost = (data) => {
    const { title, content } = data
    const errors = {}
    if (!validator.isLength(title, { min: 5, max: 100 })) {
        errors.title = 'Title must be between 5 and 100 characters.'
    }
    if (!validator.isLength(content, { min: 10, max: 1000 })) {
        errors.content = 'Content must be between 10 and 1000 characters.'
    }
    return {
        errors,
        isValid: Object.keys(errors).length === 0,
    }
}

module.exports = {
    getPosts,
    getPostsByUser,
    getPost,
    createPost,
    updatePost,
    deletePost,
}
