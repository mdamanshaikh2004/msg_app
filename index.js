require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Post = require("./models/post");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((err) => {
        console.log(err);
    });

// Routes

// Get all posts
app.get("/posts", async(req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create post
app.post("/posts", async(req, res) => {
    try {
        const newPost = new Post(req.body);
        await newPost.save();
        res.json(newPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update post
app.put("/posts/:id", async(req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json(updatedPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete post
app.delete("/posts/:id", async(req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});